"use client"

import dayjs from "dayjs"
import { cn } from '../lib/utils';
import { Button } from "./button";
import { Calendar, CalendarProps } from "./calendar"
import {
    Popover,
} from "./popover"
import React from "react";

type DatePickerProps = {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    withPresent?: boolean
} & CalendarProps

export const DatePicker = React.forwardRef<React.JSX.Element, DatePickerProps>(
    ({ value, onChange, placeholder, withPresent = false, disabled, className, mode, ...props }, ref) => {

        const renderButton = () => {
            if (value) {
                return dayjs(value).format("YYYY-MM-DD")
            }

            if (placeholder) {
                return <>{placeholder}</>
            }

            return <span>Pick a date</span>
        }

        const handleDateChange = (selectedDate: Date | undefined) => {

            if (!selectedDate) {
                return;
            }

            onChange && onChange(selectedDate)
        }

        return (
            <Popover>
                <Popover.Trigger asChild={true}>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            !value && "text-muted-foreground",
                            Boolean(disabled) && "disabled:cursor-not-allowed disabled:opacity-50",
                            className
                        )}
                        disabled={Boolean(disabled)}
                    >
                        {renderButton()}
                    </Button>
                </Popover.Trigger>
                <Popover.Content className="w-auto p-0">
                    <Calendar
                        {...props}
                        disabled={date => withPresent ? date > new Date() || date < new Date("1900-01-01") : Boolean(disabled)}
                        mode={'single'}
                        selected={value}
                        onSelect={handleDateChange}
                        initialFocus
                    />
                </Popover.Content>
            </Popover>
        )
    }
)