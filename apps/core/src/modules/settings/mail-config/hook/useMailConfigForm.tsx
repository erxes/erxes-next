import React from 'react'
import { useForm } from 'react-hook-form'
import { MailServiceFormT } from '../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { mailServiceValidationSchema } from '../schema'

const useMailConfigForm = () => {

  const form = useForm<MailServiceFormT>({
    mode: 'onBlur',
    resolver: zodResolver(mailServiceValidationSchema)
  })

  return {
    form
  }
}

export {
  useMailConfigForm
}
