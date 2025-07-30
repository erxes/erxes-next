import React from 'react'

import { IconChevronLeft } from '@tabler/icons-react';
import { Button, REACT_APP_API_URL, Spinner, Table } from 'erxes-ui';
import { Link, useParams } from 'react-router-dom';
import { PAYMENT_KINDS } from '~/modules/payment/constants';
import PaymentFormSheet from '~/modules/payment/components/PaymentFormSheet';
import { useQuery } from '@apollo/client';
import { PAYMENTS } from '~/modules/payment/graphql/queries';


const PaymentListPage = () => {
    const { kind } = useParams()
    const payment =
    PAYMENT_KINDS[kind as keyof typeof PAYMENT_KINDS];

    const { data, loading } = useQuery(PAYMENTS, {
      variables: {
        kind: kind as string,
      },
    });

    if (loading) {
        return <Spinner/>
    }

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
      <PaymentFormSheet kind={kind as string} trigger={<Button className="max-w-fit">Add {payment?.name}</Button>} />

      <Table>
        <Table.Header>
    
            <Table.Head>Payment name</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Created at</Table.Head>
            <Table.Head>Actions</Table.Head>

        </Table.Header>
        <Table.Body>
          {data?.payments?.map((payment: any) => (
            <Table.Row>
                <Table.Cell>{payment?.name}</Table.Cell>
                <Table.Cell>Active</Table.Cell>
                <Table.Cell>{payment?.createdAt}</Table.Cell>
                <Table.Cell>
                  <Button variant="outline" className="max-w-fit">Edit</Button>
                </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default PaymentListPage