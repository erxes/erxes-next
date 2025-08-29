import React from 'react'
import { Breadcrumb, Button, } from 'erxes-ui';
import { IconCalendarRepeat } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export const CyclesBreadcrumb = ({
    link
}: {
    link: string;
}) => {

  return (
    <Breadcrumb.Item>
    <Button variant="ghost" asChild>
      <Link to={link}>
        <IconCalendarRepeat />
        Cycles
      </Link>
    </Button>
  </Breadcrumb.Item>
  )
}
