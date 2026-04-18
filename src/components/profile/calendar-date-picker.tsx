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
  const [visibleMonth, setVisibleMonth] = useState(() => getMonthStart(selectedDate ?? today));

  useEffect(() => {
    setVisibleMonth(getMonthStart(selectedDate ?? today));
  }, [selectedDate, today]);

  const days = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const yearOptions = useMemo(
    () => Array.from({ length: 9 }, (_, index) => today.getFullYear() - index),
    [today],
  );
  const canGoNext =
    visibleMonth.getFullYear() < today.getFullYear() ||
    (visibleMonth.getFullYear() === today.getFullYear() && visibleMonth.getMonth() < today.getMonth());

  return (
    <div className='relative'>
      <button
        type='button'
        aria-haspopup='dialog'
        aria-expanded={isOpen}
        aria-label={value || label}
        className='surface-soft flex w-full items-center justify-between px-4 py-4 text-left text-base'
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={value ? 'font-medium text-[color:var(--text)]' : 'text-[color:var(--text-faint)]'}>
          {value || label}
        </span>
        <span className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-[rgba(255,252,247,0.94)] text-[color:var(--text-faint)]'>
          <svg viewBox='0 0 20 20' fill='none' className='h-5 w-5'>
            <path d='M5 7.5 10 12.5 15 7.5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          </svg>
        </span>
      </button>

      {isOpen ? (
        <div
          role='dialog'
          aria-label='出生日期选择器'
          className='surface-panel absolute left-0 right-0 top-[calc(100%+0.75rem)] z-10 grid gap-4 p-4 sm:p-5'
        >
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-sm font-medium text-[color:var(--text)]'>选择孩子的出生日期</p>
              <p className='mt-1 text-sm text-[color:var(--text-faint)]'>翻动月份后，直接点击日期即可。</p>
            </div>
            <button
              type='button'
              className='secondary-button px-3 py-1 text-sm'
              onClick={() => setIsOpen(false)}
            >
              关闭
            </button>
          </div>

          <div className='grid gap-3'>
            <div className='flex items-center justify-between'>
              <button
                type='button'
                className='secondary-button px-3 py-1 text-sm'
                onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
              >
                上个月
              </button>
              <div className='flex items-center gap-2'>
                <label className='sr-only' htmlFor='birth-year-select'>
                  出生年份
                </label>
                <select
                  id='birth-year-select'
                  aria-label='出生年份'
                  className='field-input min-w-[6.5rem] py-2'
                  value={visibleMonth.getFullYear()}
                  onChange={(event) =>
                    setVisibleMonth(
                      new Date(Number(event.target.value), visibleMonth.getMonth(), 1),
                    )
                  }
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}年
                    </option>
                  ))}
                </select>

                <label className='sr-only' htmlFor='birth-month-select'>
                  出生月份
                </label>
                <select
                  id='birth-month-select'
                  aria-label='出生月份'
                  className='field-input min-w-[5.5rem] py-2'
                  value={visibleMonth.getMonth() + 1}
                  onChange={(event) =>
                    setVisibleMonth(
                      new Date(visibleMonth.getFullYear(), Number(event.target.value) - 1, 1),
                    )
                  }
                >
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                    <option key={month} value={month}>
                      {String(month).padStart(2, '0')}月
                    </option>
                  ))}
                </select>
              </div>
              <button
                type='button'
                className='secondary-button px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50'
                disabled={!canGoNext}
                onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
              >
                下个月
              </button>
            </div>

            <div className='grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-faint)]'>
              {['一', '二', '三', '四', '五', '六', '日'].map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>

            <div className='grid grid-cols-7 gap-2'>
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
                    className={`rounded-2xl border px-2 py-2 text-sm transition ${
                      selected
                        ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-white'
                        : inCurrentMonth
                          ? 'border-[color:var(--line)] bg-[rgba(255,251,245,0.9)] text-[color:var(--text-soft)] hover:border-[color:var(--line-strong)] hover:bg-white'
                          : 'border-transparent bg-transparent text-[color:var(--text-faint)]'
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                    onClick={() => {
                      onChange(formatCalendarDate(day));
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
