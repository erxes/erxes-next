import React, {
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from 'react';
import * as JsSIP from 'jssip';
import {
  SipErrorTypeEnum,
  SipStatusEnum,
  CallDirectionEnum,
  CallStatusEnum,
  SipProviderProps,
  SipContextValue,
} from '../types/sipTypes';
import { useAtom } from 'jotai';
import {
  callConfigAtom,
  callInfoAtom,
  sipStateAtom,
} from '../states/sipStates';
import { getPluginAssetsUrl } from 'erxes-ui';
import { ICallConfigDoc } from '@/integrations/call/types/callTypes';
import {
  extractPhoneNumberFromCounterpart,
  logger,
  parseCallDirection,
} from '@/integrations/call/utils/callUtils';

// Context for SIP functionality
const SipContext = createContext<SipContextValue | null>(null);

const SipProvider = ({
  host = null,
  port = null,
  pathname = '',
  user = null,
  password,
  autoRegister = true,
  autoAnswer = false,
  sessionTimersExpires = 3600,
  extraHeaders = { register: [], invite: [] },
  iceServers = [],
  debug = false,
  children,
  createSession,
  updateHistory,
  addHistory,
}: SipProviderProps & { children: React.ReactNode }) => {
  const [callConfig, setCallConfig] = useAtom(callConfigAtom);
  const [callInfo, setCallInfo] = useAtom(callInfoAtom);
  // State
  const [sipState, setSipState] = useAtom(sipStateAtom);

  const setPersistentStates = useCallback(
    (isRegistered: boolean, isAvailable: boolean) => {
      setCallInfo({ isRegistered });
      setCallConfig((prev) => ({
        ...((prev || {}) as ICallConfigDoc),
        isAvailable,
      }));
    },
    [setCallConfig, setCallInfo],
  );

  // Refs for persistent values
  const uaRef = useRef<any>(null);
  const ringbackToneRef = useRef<HTMLAudioElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const loggerRef = useRef<any>(logger);

  // Configure debug logging
  const reconfigureDebug = useCallback(() => {
    if (debug) {
      JsSIP.debug.enable('JsSIP:*');
      loggerRef.current = logger;
    } else {
      JsSIP.debug.disable();
      loggerRef.current = logger;
    }
  }, [debug]);

  // Audio playback functions
  const playUnavailableAudio = useCallback(() => {
    if (!ringbackToneRef.current) {
      ringbackToneRef.current = new Audio(
        getPluginAssetsUrl('frontline', '/sound/unAvailableCall.mp3'),
      );
      ringbackToneRef.current.loop = false;
      ringbackToneRef.current
        .play()
        .catch(() => {
          ringbackToneRef.current = null;
        })
        .then(() => {
          ringbackToneRef.current = null;
        });
    }
  }, []);

  const playBusyAudio = useCallback(() => {
    if (!ringbackToneRef.current) {
      ringbackToneRef.current = new Audio(
        getPluginAssetsUrl('frontline', '/sound/busyCall.mp3'),
      );
      ringbackToneRef.current.loop = false;
      ringbackToneRef.current
        .play()
        .catch(() => {
          ringbackToneRef.current = null;
        })
        .then(() => {
          ringbackToneRef.current = null;
        });
    }
  }, []);

  const playHangupTone = useCallback(() => {
    if (!ringbackToneRef.current) {
      ringbackToneRef.current = new Audio(
        getPluginAssetsUrl('frontline', '/sound/hangup.mp3'),
      );
      ringbackToneRef.current.loop = false;
      ringbackToneRef.current
        .play()
        .catch(() => {
          ringbackToneRef.current = null;
        })
        .then(() => {
          ringbackToneRef.current = null;
        });
    }
  }, []);

  const playRingbackTone = useCallback(() => {
    if (!ringbackToneRef.current) {
      ringbackToneRef.current = new Audio(
        getPluginAssetsUrl('frontline', '/sound/outgoingRingtone.mp3'),
      );
      ringbackToneRef.current.loop = true;

      setTimeout(() => {
        ringbackToneRef.current?.play().catch(() => {
          stopRingbackTone();
        });
      }, 4000);
    } else {
      stopRingbackTone();
    }
  }, []);

  const stopRingbackTone = useCallback(() => {
    if (ringbackToneRef.current) {
      ringbackToneRef.current.pause();
      ringbackToneRef.current.currentTime = 0;
      ringbackToneRef.current = null;
    }
  }, []);

  // SIP control functions
  const registerSip = useCallback(() => {
    if (autoRegister) {
      throw new Error(
        'Calling registerSip is not allowed when autoRegister === true',
      );
    }
    if (sipState.sipStatus !== SipStatusEnum.CONNECTED) {
      throw new Error(
        `Calling registerSip is not allowed when sip status is ${sipState.sipStatus} (expected ${SipStatusEnum.CONNECTED})`,
      );
    }
    return uaRef.current?.register();
  }, [autoRegister, sipState.sipStatus]);

  const unregisterSip = useCallback(() => {
    if (autoRegister) {
      throw new Error(
        'Calling unregisterSip is not allowed when autoRegister === true',
      );
    }
    if (sipState.sipStatus !== SipStatusEnum.REGISTERED) {
      throw new Error(
        `Calling unregisterSip is not allowed when sip status is ${sipState.sipStatus} (expected ${SipStatusEnum.REGISTERED})`,
      );
    }
    return uaRef.current?.unregister();
  }, [autoRegister, sipState.sipStatus]);

  // Call control functions
  const answerCall = useCallback(() => {
    if (
      sipState.callStatus !== CallStatusEnum.STARTING ||
      sipState.callDirection !== CallDirectionEnum.INCOMING
    ) {
      throw new Error(
        `Calling answerCall() is not allowed when call status is ${sipState.callStatus} and call direction is ${sipState.callDirection}`,
      );
    }
    sipState.rtcSession?.answer({
      mediaConstraints: {
        audio: true,
        video: false,
      },
      pcConfig: {
        iceServers,
      },
    });
  }, [
    sipState.callStatus,
    sipState.callDirection,
    sipState.rtcSession,
    iceServers,
  ]);

  const startCall = useCallback(
    (destination: string) => {
      if (!destination) {
        throw new Error(`Destination must be defined (${destination} given)`);
      }
      if (
        sipState.sipStatus !== SipStatusEnum.CONNECTED &&
        sipState.sipStatus !== SipStatusEnum.REGISTERED
      ) {
        throw new Error(
          `Calling startCall() is not allowed when sip status is ${sipState.sipStatus}, expected ${SipStatusEnum.CONNECTED} or ${SipStatusEnum.REGISTERED}`,
        );
      }
      if (sipState.callStatus !== CallStatusEnum.IDLE) {
        throw new Error(
          `Calling startCall() is not allowed when call status is ${sipState.callStatus}, expected ${CallStatusEnum.IDLE}`,
        );
      }

      const options = {
        extraHeaders: extraHeaders.invite,
        mediaConstraints: { audio: true, video: false },
        pcConfig: { iceServers },
        sessionTimersExpires,
        no_answer_timeout: 3600,
        session_timers: true,
      };

      uaRef.current?.call(destination, options);
      setSipState((prev) => ({
        ...prev,
        callStatus: CallStatusEnum.STARTING,
      }));
    },
    [
      sipState.sipStatus,
      sipState.callStatus,
      extraHeaders.invite,
      iceServers,
      sessionTimersExpires,
      setSipState,
    ],
  );

  const stopCall = useCallback(() => {
    setSipState((prev) => ({ ...prev, callStatus: CallStatusEnum.IDLE }));
    uaRef.current?.terminateSessions();
  }, []);

  // Audio control functions
  const isMuted = useCallback(() => {
    return sipState.rtcSession?._audioMuted || false;
  }, [sipState.rtcSession]);

  const isHeld = useCallback(() => {
    return {
      localHold: sipState.rtcSession?._localHold,
      remoteHold: sipState.rtcSession?._remoteHold,
    };
  }, [sipState.rtcSession]);

  const mute = useCallback(() => {
    sipState.rtcSession?.mute();
  }, [sipState.rtcSession]);

  const unmute = useCallback(() => {
    sipState.rtcSession?.unmute();
  }, [sipState.rtcSession]);

  const hold = useCallback(() => {
    sipState.rtcSession?.hold();
  }, [sipState.rtcSession]);

  const unhold = useCallback(() => {
    sipState.rtcSession?.unhold();
  }, [sipState.rtcSession]);

  const sendDtmf = useCallback(
    (tones: string) => {
      sipState.rtcSession?.sendDTMF(tones);
      return 'calledSendDtmf';
    },
    [sipState.rtcSession],
  );

  // Initialize JsSIP
  const reinitializeJsSIP = useCallback(() => {
    if (uaRef.current) {
      uaRef.current.stop();
      uaRef.current = null;
    }

    if (!host || !port || !user) {
      setSipState((prev) => ({
        ...prev,
        sipStatus: SipStatusEnum.DISCONNECTED,
        sipErrorType: null,
        sipErrorMessage: null,
      }));
      return;
    }

    try {
      const socket = new JsSIP.WebSocketInterface(
        `wss://${host}:${port}${pathname}`,
      );
      const options = {
        uri: `sip:${user}@${host}`,
        password,
        sockets: [socket],
        register: autoRegister,
      };

      uaRef.current = new JsSIP.UA(options);
    } catch (error) {
      loggerRef.current.debug('Error', error.message, error);
      setSipState((prev) => ({
        ...prev,
        sipStatus: SipStatusEnum.ERROR,
        sipErrorType: SipErrorTypeEnum.CONFIGURATION,
        sipErrorMessage: error?.message,
      }));
      return;
    }

    const ua = uaRef.current;

    // Set up event handlers
    ua.on('connecting', () => {
      loggerRef.current?.debug('UA "connecting" event');
      setPersistentStates(false, true);

      if (uaRef.current !== ua) {
        return;
      }
      setSipState((prev) => ({
        ...prev,
        sipStatus: SipStatusEnum.CONNECTING,
        sipErrorType: null,
        sipErrorMessage: null,
      }));
    });

    ua.on('connected', () => {
      loggerRef.current?.debug('UA "connected" event');
      setPersistentStates(false, true);

      if (uaRef.current !== ua) {
        return;
      }
      setSipState((prev) => ({
        ...prev,
        sipStatus: SipStatusEnum.CONNECTED,
        sipErrorType: null,
        sipErrorMessage: null,
      }));
    });

    ua.on('disconnected', (e: any) => {
      loggerRef.current.debug('UA "disconnected" event');
      if (e.code === 1006) {
        setTimeout(() => reinitializeJsSIP(), 5000);
      }

      if (uaRef.current !== ua) {
        return;
      }
      setPersistentStates(false, false);
      setSipState((prev) => ({
        ...prev,
        sipStatus: SipStatusEnum.ERROR,
        sipErrorType: SipErrorTypeEnum.CONNECTION,
        sipErrorMessage: 'disconnected',
      }));
    });

    ua.on('registered', (data: any) => {
      loggerRef.current.debug('UA "registered" event', data);

      if (uaRef.current !== ua) {
        return;
      }
      setSipState((prev) => ({
        ...prev,
        sipStatus: SipStatusEnum.REGISTERED,
        callStatus: CallStatusEnum.IDLE,
      }));
      setPersistentStates(true, true);
    });

    ua.on('unregistered', () => {
      loggerRef.current.debug('UA "unregistered" event');

      if (uaRef.current !== ua) {
        return;
      }
      if (ua.isConnected()) {
        setSipState((prev) => ({
          ...prev,
          sipStatus: SipStatusEnum.CONNECTED,
          callStatus: CallStatusEnum.IDLE,
          callDirection: null,
        }));
      } else {
        setSipState((prev) => ({
          ...prev,
          sipStatus: SipStatusEnum.DISCONNECTED,
          callStatus: CallStatusEnum.IDLE,
          callDirection: null,
        }));
      }
    });

    ua.on('registrationFailed', (data: any) => {
      loggerRef.current.debug('UA "registrationFailed" event');

      if (uaRef.current !== ua) {
        return;
      }
      setSipState((prev) => ({
        ...prev,
        sipStatus: SipStatusEnum.ERROR,
        sipErrorType: SipErrorTypeEnum.REGISTRATION,
        sipErrorMessage: data?.cause || '',
      }));
    });

    ua.on('muted', () => {
      loggerRef.current.debug('UA "muted" event');
    });

    // Handle new RTC sessions (calls)
    ua.on(
      'newRTCSession',
      ({ originator, session: rtcSession, request: rtcRequest }: any) => {
        if (uaRef.current !== ua) {
          return;
        }
        if (originator === 'local') {
          const foundUri = rtcRequest.to.toString();
          const toDelimiterPosition = foundUri.indexOf(';') || null;
          setSipState((prev) => ({
            ...prev,
            callDirection: CallDirectionEnum.OUTGOING,
            callStatus: CallStatusEnum.STARTING,
            callCounterpart:
              foundUri.substring(0, toDelimiterPosition) || foundUri,
          }));

          rtcSession.connection.ontrack = (event: any) => {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(event.track);
            if (remoteAudioRef.current) {
              remoteAudioRef.current.autoplay = true;
              remoteAudioRef.current.srcObject = mediaStream;
            }
          };
        } else if (originator === 'remote') {
          const foundUri = rtcRequest.from.toString();
          const delimiterPosition = foundUri.indexOf(';') || null;
          const fromParameters = rtcRequest.from._parameters;
          const groupName = fromParameters['x-gs-group-name'] || '';
          if (debug) {
            loggerRef.current.debug('UA "newRTCSession" event', foundUri);
          }
          setSipState((prev) => ({
            ...prev,
            callDirection: CallDirectionEnum.INCOMING,
            callStatus: CallStatusEnum.STARTING,
            callCounterpart:
              foundUri.substring(0, delimiterPosition) || foundUri,
            groupName,
          }));
        }

        const diversionHeader = rtcRequest.getHeader('Diversion');
        const timeStamp = rtcRequest.getHeader('Timestamp') || 0;

        let direction = CallDirectionEnum.OUTGOING;
        let customerPhone = '';

        if (sipState.rtcSession) {
          loggerRef.current.debug('incoming call replied with 486 "Busy Here"');
          rtcSession.terminate({
            status_code: 486,
            reason_phrase: 'Busy Here',
          });
          return;
        }

        setSipState((prev) => ({ ...prev, rtcSession }));

        // Set up RTC session event handlers
        rtcSession.on('failed', (e: any) => {
          stopRingbackTone();
          loggerRef.current.debug('RTC session failed', e);
          if (uaRef.current !== ua) {
            return;
          }
          if (sipState.callDirection) {
            direction = parseCallDirection(sipState.callDirection);
          }
          if (sipState.callCounterpart) {
            customerPhone = extractPhoneNumberFromCounterpart(
              sipState.callCounterpart,
            );
          }
          if (updateHistory && sipState.rtcSession) {
            updateHistory(
              timeStamp,
              sipState.rtcSession.start_time,
              sipState.rtcSession.end_time,
              'cancelled',
              direction,
              customerPhone,
              diversionHeader || '',
              e.originator,
            );
          }
          setSipState((prev) => ({
            ...prev,
            rtcSession: null,
            callStatus: CallStatusEnum.IDLE,
            callDirection: null,
            callCounterpart: null,
          }));
          ua?.terminateSessions();
          rtcSession = null;
        });

        rtcSession.on('ended', (data: any) => {
          stopRingbackTone();
          if (uaRef.current !== ua) {
            return;
          }
          if (data.cause === 'Terminated') {
            playHangupTone();
          }

          if (sipState.callDirection) {
            direction = parseCallDirection(sipState.callDirection);
          }
          if (sipState.callCounterpart) {
            customerPhone = extractPhoneNumberFromCounterpart(
              sipState.callCounterpart,
            );
          }
          if (updateHistory && sipState.rtcSession) {
            updateHistory(
              timeStamp,
              sipState.rtcSession.start_time,
              sipState.rtcSession.end_time,
              'cancelled',
              direction,
              customerPhone,
              diversionHeader || '',
              data.originator,
            );
          }
          setSipState((prev) => ({
            ...prev,
            rtcSession: null,
            callStatus: CallStatusEnum.IDLE,
            callDirection: null,
            callCounterpart: null,
            groupName: '',
          }));
          ua?.terminateSessions();
          rtcSession = null;
        });

        rtcSession.on('bye', () => {
          if (uaRef.current !== ua) {
            return;
          }
          setSipState((prev) => ({
            ...prev,
            rtcSession: null,
            callStatus: CallStatusEnum.IDLE,
            callDirection: null,
            callCounterpart: null,
            groupName: '',
          }));
          ua?.terminateSessions();
          rtcSession = null;
        });

        rtcSession.on('rejected', () => {
          if (uaRef.current !== ua) {
            return;
          }
          if (updateHistory && sipState.rtcSession) {
            updateHistory(
              timeStamp,
              sipState.rtcSession.start_time,
              sipState.rtcSession.end_time,
              'rejected',
            );
          }
          setSipState((prev) => ({
            ...prev,
            rtcSession: null,
            callStatus: CallStatusEnum.IDLE,
            callDirection: null,
            callCounterpart: null,
            groupName: '',
          }));
          ua?.terminateSessions();
        });

        rtcSession.on('accepted', () => {
          stopRingbackTone();
          if (uaRef.current !== ua) {
            return;
          }
          if (sipState.callDirection) {
            direction = parseCallDirection(sipState.callDirection);
          }
          if (sipState.callCounterpart) {
            customerPhone = extractPhoneNumberFromCounterpart(
              sipState.callCounterpart,
            );
          }
          if (addHistory) {
            addHistory(
              'active',
              timeStamp,
              direction,
              customerPhone,
              sipState.rtcSession.start_time,
              sipState.groupName,
            );
          }
          if (originator === 'remote' && remoteAudioRef.current) {
            remoteAudioRef.current.srcObject =
              rtcSession.connection.getRemoteStreams();
          }

          const playPromise = remoteAudioRef.current?.play();
          if (playPromise) {
            playPromise
              .catch(() => {
                loggerRef.current?.debug('Error playing remote audio');
              })
              .then(() => {
                setTimeout(() => {
                  remoteAudioRef.current?.play();
                }, 2000);
              });
            setSipState((prev) => ({
              ...prev,
              callStatus: CallStatusEnum.ACTIVE,
            }));
            return;
          }

          // Retry playback after 2 s: handles browsers that don’t return a Promise from play() or silently block the initial play call
          setTimeout(() => {
            remoteAudioRef.current?.play();
          }, 2000);
          setSipState((prev) => ({
            ...prev,
            callStatus: CallStatusEnum.ACTIVE,
          }));
        });

        // Auto-answer logic
        // used orignator === 'remote' to check if the call is incoming instead of sipState.callDirection === 'incoming'
        if (originator === 'remote' && autoAnswer) {
          answerCall();
        }
        // used orignator === 'local' to check if the call is outgoing instead of sipState.callDirection === 'outgoing'
        // if (originator === 'local') {
        //   setTimeout(() => {
        //     remoteAudioRef.current?.play();
        //   }, 2000);
        // }
      },
    );

    // Set extra headers and start UA
    const extraHeadersRegister = extraHeaders.register || [];
    if (extraHeadersRegister.length) {
      ua.registrator().setExtraHeaders(extraHeadersRegister);
    }
    ua.start();
  }, [
    addHistory,
    answerCall,
    autoAnswer,
    autoRegister,
    extraHeaders.register,
    host,
    password,
    pathname,
    playHangupTone,
    port,
    setPersistentStates,
    setSipState,
    sipState.callCounterpart,
    sipState.callDirection,
    sipState.groupName,
    sipState.rtcSession,
    stopRingbackTone,
    updateHistory,
    user,
  ]);

  // Initialize audio element and JsSIP on mount
  useEffect(() => {
    if (
      sipState.sipStatus === SipStatusEnum.REGISTERED &&
      callInfo?.isUnregistered
    ) {
      unregisterSip();
    }
    if (callConfig && !callConfig.isAvailable) {
      return;
    }

    if (document.getElementById('sip-provider-audio')) {
      throw new Error(
        'Creating two SipProviders in one application is forbidden',
      );
    }

    const audioElement = document.createElement('audio');
    audioElement.id = 'sip-provider-audio';
    document.body.appendChild(audioElement);
    remoteAudioRef.current = audioElement;

    reconfigureDebug();
    reinitializeJsSIP();

    return () => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.parentNode?.removeChild(remoteAudioRef.current);
        remoteAudioRef.current = null;
      }
      if (uaRef.current) {
        uaRef.current.stop();
        uaRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle prop changes
  useEffect(() => {
    if (debug !== undefined) {
      reconfigureDebug();
    }
  }, [debug, reconfigureDebug]);

  // Create context value
  const contextValue = useMemo(
    () => ({
      sip: {
        createSession,
        updateHistory,
        addHistory,
      },
      registerSip,
      unregisterSip,
      answerCall,
      startCall,
      stopCall,
      isMuted,
      mute,
      unmute,
      sendDtmf,
      isHeld,
      hold,
      unhold,
    }),
    [
      createSession,
      updateHistory,
      addHistory,
      registerSip,
      unregisterSip,
      answerCall,
      startCall,
      stopCall,
      isMuted,
      mute,
      unmute,
      sendDtmf,
      isHeld,
      hold,
      unhold,
    ],
  );

  return (
    <SipContext.Provider value={contextValue}>{children}</SipContext.Provider>
  );
};

// Custom hook to use SIP context
export const useSip = () => {
  const context = useContext(SipContext);
  if (!context) {
    throw new Error('useSip must be used within a SipProvider');
  }
  return context;
};

export default SipProvider;
