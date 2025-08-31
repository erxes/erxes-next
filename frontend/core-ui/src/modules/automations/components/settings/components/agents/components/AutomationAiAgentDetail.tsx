import { UploadDropzone } from '@/automations/components/settings/components/agents/components/DropFilesZone';
import { FileGrid } from '@/automations/components/settings/components/agents/components/FilesList';
import { AI_AGENT_KINDS } from '@/automations/components/settings/components/agents/constants/automationAiAgents';
import {
  AiAgentInput,
  useAiAgentDetail,
} from '@/automations/components/settings/components/agents/hooks/useAiAgentDetail';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Form, Input, Tabs, Textarea, toast } from 'erxes-ui';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { z } from 'zod';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { useState, useEffect } from 'react';

const START_AI_TRAINING = gql`
  mutation StartAiTraining($agentId: String!) {
    startAiTraining(agentId: $agentId) {
      agentId
      totalFiles
      processedFiles
      status
      error
    }
  }
`;

const GET_TRAINING_STATUS = gql`
  query GetTrainingStatus($agentId: String!) {
    getTrainingStatus(agentId: $agentId) {
      agentId
      totalFiles
      processedFiles
      status
      error
    }
  }
`;

const GENERATE_AGENT_MESSAGE = gql`
  mutation GenerateAgentMessage($agentId: String!, $question: String!) {
    generateAgentMessage(agentId: $agentId, question: $question) {
      message
      relevantFile
      similarity
    }
  }
`;

const aiAgentFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  provider: z.string(),
  prompt: z.string(),
  instructions: z.string(),
  files: z.array(
    z.object({
      id: z.string(),
      key: z.string(),
      name: z.string(),
      size: z.number(),
      type: z.string(),
      uploadedAt: z.string(),
    }),
  ),
  config: z.any(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TAiAgentForm = z.infer<typeof aiAgentFormSchema>;

export const AutomationAiAgentDetail = ({
  detail,
  handleSave,
}: {
  detail: any;
  handleSave: (input: AiAgentInput) => Promise<any>;
}) => {
  const form = useForm<TAiAgentForm>({
    resolver: zodResolver(aiAgentFormSchema),
    values: {
      ...detail,
    },
  });

  const [isTraining, setIsTraining] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<
    Array<{ question: string; answer: string; timestamp: Date }>
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Start AI Training mutation
  const [startTraining] = useMutation(START_AI_TRAINING, {
    onCompleted: () => {
      setIsTraining(true);
    },
    onError: (error) => {
      console.error('Training failed:', error);
      setIsTraining(false);
    },
  });

  // Get training status
  const { data: trainingStatus, refetch: refetchStatus } = useQuery(
    GET_TRAINING_STATUS,
    {
      variables: { agentId: detail?._id },
      skip: !detail?._id,
      pollInterval: isTraining ? 2000 : 0, // Poll every 2 seconds when training
    },
  );

  // Generate agent message mutation
  const [generateMessage] = useMutation(GENERATE_AGENT_MESSAGE, {
    onCompleted: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          question,
          answer: data.generateAgentMessage.message,
          timestamp: new Date(),
        },
      ]);
      setQuestion('');
      setIsGenerating(false);
    },
    onError: ({ message }) => {
      toast({
        title: 'Failed to generate message',
        description: message,
      });
      setIsGenerating(false);
    },
  });

  // Monitor training progress
  useEffect(() => {
    if (trainingStatus?.getTrainingStatus?.status === 'completed') {
      setIsTraining(false);
    } else if (trainingStatus?.getTrainingStatus?.status === 'failed') {
      setIsTraining(false);
    }
  }, [trainingStatus]);

  const handleStartTraining = async () => {
    if (!detail?._id) return;

    try {
      setIsTraining(true);
      await startTraining({ variables: { agentId: detail._id } });
    } catch (error) {
      console.error('Failed to start training:', error);
      setIsTraining(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!detail?._id || !question.trim()) return;

    try {
      setIsGenerating(true);
      await generateMessage({
        variables: {
          agentId: detail._id,
          question: question.trim(),
        },
      });
    } catch (error) {
      console.error('Failed to ask question:', error);
      setIsGenerating(false);
    }
  };

  const { img, label } =
    AI_AGENT_KINDS.find(({ type }) => type === detail?.provider) || {};

  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-sidebar py-2 px-4 border-b">
        <Card className="p-3 flex flex-col gap-2 rounded-lg w-48">
          <div className="flex gap-2 mb-2 items-center">
            <div className="size-8 rounded overflow-hidden shadow-sm bg-background">
              <img
                src={img}
                alt={detail?.provider}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <h6 className="font-semibold text-sm self-center">{label}</h6>
          </div>
        </Card>
      </div>
      <div className="flex flex-col flex-1  px-4 pb-4">
        <FormProvider {...form}>
          <Tabs defaultValue="general" className="flex-1">
            <Tabs.List>
              <Tabs.Trigger className="w-1/3" value="general">
                General
              </Tabs.Trigger>
              <Tabs.Trigger className="w-1/3" value="files">
                Files
              </Tabs.Trigger>
              <Tabs.Trigger className="w-1/3" value="training">
                Training
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="general" className="flex flex-col gap-2">
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Name</Form.Label>
                    <Form.Control>
                      <Input
                        type="text"
                        placeholder="Enter your ai agent name"
                        {...field}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>description</Form.Label>
                    <Form.Control>
                      <Textarea
                        placeholder="Enter your ai agent description"
                        {...field}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />

              <Form.Field
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>prompt</Form.Label>
                    <Form.Control>
                      <Textarea
                        placeholder="Enter your ai agent prompt"
                        {...field}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>instructions</Form.Label>
                    <Form.Control>
                      <Textarea
                        placeholder="Enter your ai agent instructions"
                        {...field}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </Tabs.Content>
            <Tabs.Content value="files" className="px-6 py-4">
              {/* Upload Section */}
              <Form.Field
                control={form.control}
                name="files"
                render={({ field }) => (
                  <UploadDropzone
                    onFilesUploaded={(files) => {
                      const newFiles = files.map(
                        ({ key, name, size, type, uploadedAt }) => ({
                          id: Math.random().toString(36).substr(2, 9),
                          key,
                          name,
                          size,
                          type,
                          uploadedAt: uploadedAt.toISOString(),
                        }),
                      );

                      field.onChange([...(field.value || []), ...newFiles]);
                    }}
                  />
                )}
              />

              <Form.Field
                control={form.control}
                name="files"
                render={({ field }) => (
                  <Form.Item className="pt-4">
                    <Form.Label>Uploaded Files</Form.Label>
                    <Form.Control className="">
                      <FileGrid
                        files={field.value}
                        onFileDelete={(fileId) =>
                          field.onChange(
                            field.value.filter(({ id }) => fileId !== id),
                          )
                        }
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </Tabs.Content>
            <Tabs.Content value="training" className="flex flex-col h-full">
              {/* Training Status Section */}
              <div className="mb-6 p-4 border rounded-lg ">
                <h3 className="text-lg font-semibold mb-4">
                  AI Training Status
                </h3>

                {trainingStatus?.getTrainingStatus && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Files Processed:</span>
                      <span className="font-medium">
                        {trainingStatus.getTrainingStatus.processedFiles} /{' '}
                        {trainingStatus.getTrainingStatus.totalFiles}
                      </span>
                    </div>

                    <div className="w-full  rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            trainingStatus.getTrainingStatus.totalFiles > 0
                              ? (trainingStatus.getTrainingStatus
                                  .processedFiles /
                                  trainingStatus.getTrainingStatus.totalFiles) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span
                        className={`font-medium ${
                          trainingStatus.getTrainingStatus.status ===
                          'completed'
                            ? 'text-green-600'
                            : trainingStatus.getTrainingStatus.status ===
                              'failed'
                            ? 'text-red-600'
                            : trainingStatus.getTrainingStatus.status ===
                              'processing'
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {trainingStatus.getTrainingStatus.status}
                      </span>
                    </div>

                    {trainingStatus.getTrainingStatus.error && (
                      <div className="text-red-600 text-sm">
                        Error: {trainingStatus.getTrainingStatus.error}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4">
                  <Button
                    onClick={handleStartTraining}
                    disabled={isTraining || !form.watch('files')?.length}
                    className="w-full"
                  >
                    {isTraining
                      ? 'Training in Progress...'
                      : 'Start AI Training'}
                  </Button>
                </div>
              </div>

              {/* Chat Section */}
              {trainingStatus?.getTrainingStatus?.status === 'completed' && (
                <div className="mb-6 p-4 border rounded-lg bg-background flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-4">
                    Ask Your AI Agent
                  </h3>

                  {/* Chat Messages */}
                  <div className="mb-4 max-h-64 overflow-y-auto space-y-3">
                    {messages.map((msg, index) => (
                      <div key={index} className="space-y-2">
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-sm text-gray-600 mb-1">You:</div>
                          <div>{msg.question}</div>
                        </div>
                        <div className="bg-background p-3 rounded-lg border">
                          <div className="text-sm text-gray-600 mb-1">
                            AI Agent:
                          </div>
                          <div>{msg.answer}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Question Input */}
                  <div className="flex gap-2">
                    <Input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask a question about your uploaded files..."
                      onKeyPress={(e) =>
                        e.key === 'Enter' && handleAskQuestion()
                      }
                      disabled={isGenerating}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAskQuestion}
                      disabled={isGenerating || !question.trim()}
                    >
                      {isGenerating ? 'Generating...' : 'Ask'}
                    </Button>
                  </div>
                </div>
              )}
            </Tabs.Content>
          </Tabs>
          <div className="flex justify-end pt-4 gap-2">
            <Link to={`/settings/automations/agents`}>
              <Button variant="secondary">Back</Button>
            </Link>
            <Button
              onClick={form.handleSubmit(handleSave, (error) => {
                toast({
                  title: 'Invalid form',
                  description: JSON.stringify(error),
                });
              })}
            >
              Save
            </Button>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};
