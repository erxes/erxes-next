import {
  BOARD_STATUSES_OPTIONS,
  PROBABILITY_DEAL,
  VISIBLITIES,
} from '../../constants/stages';
import { Checkbox, Form, Input, Select } from 'erxes-ui';

import { IStage } from '@/deals/types/stages';

const PipelineStageItem = (props: any) => {
  const {
    value,
    dragging,
    dragOverlay,
    listeners,
    style,
    disabled,
    handle,
    color,
    fadeIn,
    transition,
    transform,
    wrapperStyle,
    index,
    stages,
  } = props;

  const stage = (stages || []).find((s: IStage) => s._id === value);
  console.log(index, stage);

  return (
    <div
      className={`
        flex box-border origin-top-left touch-manipulation [transform:translate3d(var(--translate-x,0),var(--translate-y,0),0)_scaleX(var(--scale-x,1))_scaleY(var(--scale-y,1))]
        ${fadeIn ? 'animate-fadeIn' : ''}
        ${
          dragOverlay
            ? 'z-[999] [--scale:1.05] [--box-shadow:0_0_0_calc(1px/var(--scale-x,1))_rgba(63,63,68,0.05),0_1px_calc(3px/var(--scale-x,1))_0_rgba(34,33,81,0.15)] [--box-shadow-picked-up:0_0_0_calc(1px/var(--scale-x,1))_rgba(63,63,68,0.05),-1px_0_15px_0_rgba(34,33,81,0.01),0px_15px_15px_0_rgba(34,33,81,0.25)]'
            : ''
        }
      `}
      style={
        {
          ...wrapperStyle,
          transition: [transition, wrapperStyle?.transition]
            .filter(Boolean)
            .join(', '),
          '--translate-x': transform
            ? `${Math.round(transform.x)}px`
            : undefined,
          '--translate-y': transform
            ? `${Math.round(transform.y)}px`
            : undefined,
          '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
          '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
          '--index': index,
          '--color': color,
        } as React.CSSProperties
      }
    >
      <div
        className={`
          relative flex flex-grow items-center
          px-5 py-[18px] bg-white rounded
          shadow-md list-none select-none
          text-gray-800 font-normal text-base
          whitespace-nowrap
          transition-shadow duration-200 ease-out
          ${!handle ? 'cursor-grab touch-manipulation' : ''}
          ${dragging && !dragOverlay ? 'opacity-50' : ''}
          ${disabled ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : ''}
          ${dragOverlay ? 'cursor-default shadow-lg' : ''}
        `}
        style={style}
        data-cypress="draggable-item"
        {...(!handle ? listeners : undefined)}
        {...props}
        tabIndex={!handle ? 0 : undefined}
      >
        <span className="absolute top-1/2 left-0 h-full w-[3px] -translate-y-1/2 rounded-l-sm bg-purple-500" />
        <div className="flex flex-1 items-center justify-between gap-3">
          <Form.Item>
            <Form.Label>Stage Name</Form.Label>
            <Form.Control>
              <Input
                type="text"
                placeholder="Enter stage name"
                className="input"
                value={stage?.name}
                onChange={(e) => {
                  console.log(e.target.value);
                }}
              />
            </Form.Control>
            <Form.Message />
          </Form.Item>
          <Form.Item>
            <Form.Label>Probality</Form.Label>
            <Select
              // onValueChange={(value) => {
              //   setVisibility(value);
              // }}
              value="10%"
            >
              <Select.Trigger className={'text-muted-foreground'}>
                {'Select probality'}
              </Select.Trigger>
              <Select.Content>
                {PROBABILITY_DEAL.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Form.Item>
          <Form.Item>
            <Form.Label>Status</Form.Label>
            <Select
              // onValueChange={(value) => {
              //   setVisibility(value);
              // }}
              value="10%"
            >
              <Select.Trigger className={'text-muted-foreground'}>
                {'Select status'}
              </Select.Trigger>
              <Select.Content>
                {BOARD_STATUSES_OPTIONS.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Form.Item>
          <Form.Item>
            <Form.Label>Visibility</Form.Label>
            <Select
              // onValueChange={(value) => {
              //   setVisibility(value);
              // }}
              value="10%"
            >
              <Select.Trigger className={'text-muted-foreground'}>
                {'Select visibility'}
              </Select.Trigger>
              <Select.Content>
                {VISIBLITIES.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Form.Item>
          <Form.Item>
            <Form.Label>Code</Form.Label>
            <Form.Control>
              <Input type="text" placeholder="Enter code" className="input" />
            </Form.Control>
            <Form.Message />
          </Form.Item>
          <Form.Item>
            <Form.Label>Age</Form.Label>
            <Form.Control>
              <Input type="text" placeholder="Enter age" className="input" />
            </Form.Control>
            <Form.Message />
          </Form.Item>
          <Form.Item className="flex flex-row items-center justify-center space-x-3 space-y-0">
            <Form.Control>
              <Checkbox
                checked={false}
                // onCheckedChange={field.onChange}
              />
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label>Can move members</Form.Label>
            <Select
              // onValueChange={(value) => {
              //   setVisibility(value);
              // }}
              value="10%"
            >
              <Select.Trigger className={'text-muted-foreground'}>
                {'Select visibility'}
              </Select.Trigger>
              <Select.Content>
                {VISIBLITIES.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Form.Item>
          <Form.Item>
            <Form.Label>Can edit members</Form.Label>
            <Select
              // onValueChange={(value) => {
              //   setVisibility(value);
              // }}
              value="10%"
            >
              <Select.Trigger className={'text-muted-foreground'}>
                {'Select visibility'}
              </Select.Trigger>
              <Select.Content>
                {VISIBLITIES.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default PipelineStageItem;
