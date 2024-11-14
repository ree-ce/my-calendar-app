'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const BatchInput = ({
  value,
  onChange,
  onConfirm,
  onCancel
}) => (
  <div className="mt-8 mb-4">
    <Textarea
      value={value}
      onChange={onChange}
      placeholder="One event per line&#10;Format: YYYY/MM/DD~YYYY/MM/DD Event Name&#10;Example:&#10;2024/12/15 Event 1&#10;2024/12/22~2024/12/23 Event 2"
      className="min-h-[120px] mb-2 text-sm"
    />
    <div className="flex gap-2">
      <Button
        onClick={onConfirm}
        className="text-sm"
      >
        Confirm
      </Button>
      <Button
        variant="outline"
        className="text-sm"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  </div>
);

export default BatchInput;
