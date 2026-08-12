'use client';

import { cn } from '@/lib/utils';
import { Delete, CornerDownLeft } from 'lucide-react';
import { KEYBOARD_LAYOUT } from '@/lib/constants';
import { KeyState } from '@/types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStates: Map<string, KeyState>;
  disabled?: boolean;
}

export function Keyboard({ onKeyPress, keyStates, disabled = false }: KeyboardProps) {
  const getKeyStyle = (key: string) => {
    const state = keyStates.get(key) || 'unused';
    
    // Structured monochrome key states — mirrors tile logic
    const styles: Record<KeyState, string> = {
      unused: 'bg-bone text-ink border border-vellum hover:bg-chalk',
      correct: 'bg-ink text-paper border-0 hover:opacity-80',
      present: 'bg-graphite text-paper border-0 hover:opacity-80',
      absent: 'bg-chalk text-graphite border border-vellum opacity-50 hover:opacity-60',
    };

    return styles[state];
  };

  const handleKeyPress = (key: string) => {
    if (disabled) return;
    onKeyPress(key);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex flex-col gap-1.5">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => {
              const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
              
              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  disabled={disabled}
                  className={cn(
                    'h-12 rounded-cards text-xs font-medium font-sans transition-all disabled:opacity-40 disabled:cursor-not-allowed md:h-14 md:text-sm select-none',
                    isSpecial
                      ? 'px-3 md:px-4 bg-ink text-paper hover:opacity-80'
                      : cn('w-8 px-1 md:w-10', getKeyStyle(key))
                  )}
                >
                  {key === 'BACKSPACE' ? (
                    <Delete className="h-4 w-4 mx-auto" />
                  ) : key === 'ENTER' ? (
                    <CornerDownLeft className="h-4 w-4 mx-auto" />
                  ) : (
                    key
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
