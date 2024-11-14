'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ZoomIn, ZoomOut, LayoutGrid, LayoutList, Plus, ListPlus } from 'lucide-react';

export const Controls = ({
  newEventInput,
  onEventInputChange,
  onAddOrUpdate,
  isEditing,
  onCancelEdit,
  onToggleBatch,
  onZoomIn,
  onZoomOut,
  isGridView,
  onToggleView
}) => (
  <div className="space-y-4">
    {/* Event input row */}
    <div className="flex flex-wrap gap-2">
      <div className="flex-1 min-w-[300px] flex gap-2">
        <Input
          value={newEventInput}
          onChange={onEventInputChange}
          placeholder="Format: YYYY/MM/DD~YYYY/MM/DD Event Name or YYYY/MM/DD Event Name"
          className="flex-1 text-sm"
        />
        <Button
          onClick={onAddOrUpdate}
          className="whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-1" />
          {isEditing ? 'Update Event' : 'Add Event'}
        </Button>
      </div>
    </div>

    {/* Controls row */}
    <div className="flex flex-wrap items-center gap-2">
      {/* Left side - View controls */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="whitespace-nowrap"
          onClick={onZoomIn}
        >
          <ZoomIn className="w-4 h-4 mr-1" />
          Zoom In
        </Button>
        <Button
          variant="outline"
          className="whitespace-nowrap"
          onClick={onZoomOut}
        >
          <ZoomOut className="w-4 h-4 mr-1" />
          Zoom Out
        </Button>
        <Button
          variant="outline"
          className="whitespace-nowrap"
          onClick={onToggleView}
        >
          {isGridView ? (
            <>
              <LayoutList className="w-4 h-4 mr-1" />
              List View
            </>
          ) : (
            <>
              <LayoutGrid className="w-4 h-4 mr-1" />
              Grid View
            </>
          )}
        </Button>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex gap-2 ml-auto">
        {isEditing && (
          <Button
            variant="outline"
            className="whitespace-nowrap"
            onClick={onCancelEdit}
          >
            Cancel Edit
          </Button>
        )}
        <Button
          variant="outline"
          className="whitespace-nowrap"
          onClick={onToggleBatch}
        >
          <ListPlus className="w-4 h-4 mr-1" />
          Batch Add
        </Button>
      </div>
    </div>
  </div>
);

export default Controls;