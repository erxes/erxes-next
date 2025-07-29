import React from 'react'

import { IconChevronLeft } from '@tabler/icons-react';
import { Button, getPluginAssetsUrl, REACT_APP_API_URL } from 'erxes-ui';
import { lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PAYMENTS } from '~/modules/payment/constants';
import PaymentFormSheet from '~/modules/payment/components/PaymentFormSheet';

const PaymentListPage = () => {
    const { kind } = useParams()
    const payment =
    PAYMENTS[kind as keyof typeof PAYMENTS];

  return (
    <div className="mx-auto p-5 w-full max-w-5xl flex flex-col gap-8 overflow-hidden">
      <div>
        <Button variant="ghost" className="text-muted-foreground" asChild>
          <Link to="/settings/payment">
            <IconChevronLeft />
            Payment methods
          </Link>
        </Button>
      </div>
      <div className="flex gap-2">
        <img
          className="w-10 h-10 object-contain rounded-md"
          src={
            REACT_APP_API_URL +
            '/pl:payment/static/images/payments/' +
            kind +
            '.png'
          }
          alt={payment?.name}
        />
        <div className="flex flex-col gap-1">
          <h6 className="font-semibold text-sm">{payment?.name}</h6>
          <span className="text-sm text-muted-foreground font-medium">
            {payment?.description}
          </span>
        </div>
      </div>
      <PaymentFormSheet kind={kind as string} />
    </div>
  );
}

export default PaymentListPage