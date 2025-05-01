import React from 'react';
import { useForm } from 'react-hook-form';
import { StructureDetailsFormT } from '../types/structure';
import { zodResolver } from '@hookform/resolvers/zod';
import { STRUCTURE_DETAILS_SCHEMA } from '../schemas/structureSchema';

export const useStructureDetailsForm = () => {
  const methods = useForm<StructureDetailsFormT>({
    mode: 'onBlur',
    defaultValues: {
      _id: '',
      title: '',
      description: '',
      code: '',
      coordinate: {
        latitude: '',
        longitude: '',
      },
      email: '',
      image: {
        name: '',
        url: '',
        type: '',
      },
      phoneNumber: '',
      supervisor: {
        email: '',
        details: {
          firstName: '',
          lastName: '',
          fullName: '',
          operatorPhone: '',
          position: '',
          shortName: '',
          avatar: '',
          description: '',
        },
      },
      supervisorId: '',
    },
    resolver: zodResolver(STRUCTURE_DETAILS_SCHEMA),
  });
  return {
    methods,
  };
};
