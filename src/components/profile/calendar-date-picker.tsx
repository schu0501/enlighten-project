'use client';

import { useEffect, useMemo, useState } from 'react';

import { formatCalendarDate, parseCalendarDate } from '@/lib/age';

type CalendarDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function isSameDate(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function CalendarDatePicker({
  value,
  onChange,
  label = '请选择出生日期',
}: CalendarDatePickerProps) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const selectedDate = useMemo(() => {
    if (!value) {
      return null;
    }

    try {
      return parseCalendarDate(value);
    } catch {
      return null;
    }
  }, [value]);
  const [isOpen, setIsOpen] = useState(false);
  const [showMonthAdjuster, setShowMonthAdjuster] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => getMonthStart(selectedDate ?? today));

  useEffect(() => {
    setVisibleMonth(getMonthStart(selectedDate ?? today));
  }, [selectedDate, today]);

  const days = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const todayMonthStart = useMemo(() => getMonthStart(today), [today]);

  function canMoveToMonth(year: number, month: number) {
    return new Date(year, month, 1) <= todayMonthStart;
  }

  const canGoNext = canMoveToMonth(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1);

  return (
    <div className='relative'>
      <button
        type='button'
        aria-haspopup='dialog'
        aria-expanded={isOpen}
        aria-label={value || label}
        className='surface-soft flex w-full items-center justify-between px-3.5 py-3 text-left text-sm'
        onClick={() => {
          setIsOpen((current) => !current);
          setShowMonthAdjuster(false);
        }}
      >
        <span className={value ? 'text-sm font-medium text-[color:var(--text)]' : 'text-sm text-[color:var(--text-faint)]'}>
          {value || label}
        </span>
        <span className='inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--line)] bg-[rgba(255,252,247,0.94)] text-[color:var(--text-faint)]'>
          <svg viewBox='0 0 20 20' fill='none' className='h-3.5 w-3.5'>
            <path d='M5 7.5 10 12.5 15 7.5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          </svg>
        </span>
      </button>

      {isOpen ? (
        <div
          role='dialog'
          aria-label='出生日期选择器'
          className='surface-panel absolute left-0 top-[calc(100%+0.625rem)] z-10 grid w-[min(100%,18rem)] gap-2.5 p-2.5 sm:p-3'
        >
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-[11px] font-semibold text-[color:var(--text)]'>选择孩子的出生日期</p>
              <p className='mt-0.5 text-[10px] text-[color:var(--text-faint)]'>翻动月份后，直接点击日期即可。</p>
            </div>
            <button
              type='button'
              aria-label='关闭日期选择器'
              className='inline-flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--line)] bg-[rgba(255,252,247,0.98)] text-[color:var(--text-faint)] shadow-[0_8px_20px_-18px_rgba(84,63,43,0.45)] transition hover:border-[color:var(--line-strong)] hover:bg-white hover:text-[color:var(--text-soft)]'
              onClick={() => setIsOpen(false)}
            >
              <svg viewBox='0 0 20 20' fill='none' className='h-3 w-3' aria-hidden='true'>
                <path d='M6 6 14 14M14 6 6 14' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
              </svg>
            </button>
          </div>

          <div className='grid gap-3'>
            <div className='flex items-center justify-between'>
              <button
                type='button'
                aria-label='上个月'
                className='inline-flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--line)] bg-[rgba(255,252,247,0.98)] text-[color:var(--text-soft)] shadow-[0_8px_20px_-18px_rgba(84,63,43,0.45)] transition hover:border-[color:var(--line-strong)] hover:bg-white'
                onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
              >
                <svg viewBox='0 0 20 20' fill='none' className='h-3 w-3'>
                  <path d='M12.5 4.5 7 10l5.5 5.5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              </button>
              <button
                type='button'
                aria-label='修改年月'
                className='rounded-full border border-[rgba(126,99,73,0.12)] bg-[rgba(255,250,244,0.94)] px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.06em] text-[color:var(--text-soft)] transition hover:border-[color:var(--line-strong)] hover:bg-white'
                onClick={() => setShowMonthAdjuster((current) => !current)}
              >
                {visibleMonth.getFullYear()}年 {String(visibleMonth.getMonth() + 1).padStart(2, '0')}月
              </button>
              <button
                type='button'
                aria-label='下个月'
                className='inline-flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--line)] bg-[rgba(255,252,247,0.98)] text-[color:var(--text-soft)] shadow-[0_8px_20px_-18px_rgba(84,63,43,0.45)] transition hover:border-[color:var(--line-strong)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40'
                disabled={!canGoNext}
                onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
              >
                <svg viewBox='0 0 20 20' fill='none' className='h-3 w-3'>
                  <path d='M7.5 4.5 13 10l-5.5 5.5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              </button>
            </div>

            {showMonthAdjuster ? (
              <div className='grid gap-1.5 rounded-2xl border border-[rgba(126,99,73,0.1)] bg-[rgba(255,252,247,0.72)] p-2'>
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-[9px] font-semibold tracking-[0.12em] text-[color:var(--text-faint)]'>年份</span>
                  <div className='flex items-center gap-1.5'>
                    <button
                      type='button'
                      aria-label='减少年份'
                      className='inline-flex h-5 w-5 items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-[10px] text-[color:var(--text-soft)]'
                      onClick={() => setVisibleMonth((current) => new Date(current.getFullYear() - 1, current.getMonth(), 1))}
                    >
                      -
                    </button>
                    <span className='min-w-[3.5rem] text-center text-[10px] font-medium text-[color:var(--text)]'>
                      {visibleMonth.getFullYear()}年
                    </span>
                    <button
                      type='button'
                      aria-label='增加年份'
                      className='inline-flex h-5 w-5 items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-[10px] text-[color:var(--text-soft)] disabled:cursor-not-allowed disabled:opacity-40'
                      disabled={!canMoveToMonth(visibleMonth.getFullYear() + 1, visibleMonth.getMonth())}
                      onClick={() => setVisibleMonth((current) => new Date(current.getFullYear() + 1, current.getMonth(), 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className='flex items-center justify-between gap-3'>
                  <span className='text-[9px] font-semibold tracking-[0.12em] text-[color:var(--text-faint)]'>月份</span>
                  <div className='flex items-center gap-1.5'>
                    <button
                      type='button'
                      aria-label='减少月份'
                      className='inline-flex h-5 w-5 items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-[10px] text-[color:var(--text-soft)]'
                      onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                    >
                      -
                    </button>
                    <span className='min-w-[2.5rem] text-center text-[10px] font-medium text-[color:var(--text)]'>
                      {String(visibleMonth.getMonth() + 1).padStart(2, '0')}月
                    </span>
                    <button
                      type='button'
                      aria-label='增加月份'
                      className='inline-flex h-5 w-5 items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-[10px] text-[color:var(--text-soft)] disabled:cursor-not-allowed disabled:opacity-40'
                      disabled={!canMoveToMonth(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1)}
                      onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className='grid grid-cols-7 gap-1 text-center text-[9px] font-semibold uppercase tracking-[0.1em] text-[color:var(--text-faint)]'>
              {['一', '二', '三', '四', '五', '六', '日'].map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>

            <div className='grid grid-cols-7 gap-1'>
              {days.map((day) => {
                const inCurrentMonth = day.getMonth() === visibleMonth.getMonth();
                const disabled = day > today;
                const selected = selectedDate ? isSameDate(day, selectedDate) : false;

                return (
                  <button
                    key={day.toISOString()}
                    type='button'
                    aria-label={formatCalendarDate(day)}
                    disabled={disabled}
                    className={`rounded-lg border px-1 py-1 text-[10px] transition ${
                      selected
                        ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-white'
                        : inCurrentMonth
                          ? 'border-[color:var(--line)] bg-[rgba(255,251,245,0.9)] text-[color:var(--text-soft)] hover:border-[color:var(--line-strong)] hover:bg-white'
                          : 'border-transparent bg-transparent text-[color:var(--text-faint)]'
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                    onClick={() => {
                      onChange(formatCalendarDate(day));
                      setShowMonthAdjuster(false);
                      setIsOpen(false);
                    }}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
