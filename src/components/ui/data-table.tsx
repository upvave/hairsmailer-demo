'use client';

import {
  Button,
  cn,
  Input,
  Pagination,
  Skeleton,
  SlotsToClasses,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TableSlots,
} from '@heroui/react';
import Link from 'next/link';
import React, { useRef } from 'react';
import { CiSearch } from 'react-icons/ci';
import { PiPlus } from 'react-icons/pi';
import { RiRefreshLine } from 'react-icons/ri';
import { SlDrawer } from 'react-icons/sl';

type ColumnType = {
  title: string | React.ReactNode;
  key: string;
  icon?: React.ElementType;
  align?: 'left' | 'center' | 'right';
  className?: string;
  RowClassName?: string;
  allowsSorting?: boolean;
  SkeletonComponent?: React.ReactNode;
  component?: (
    data: any,
    rowData: Record<string, any>,
    index: number,
  ) => React.ReactNode;
};

type PaginationType = {
  totalItems: number;
  onThisPage: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  counterLabel?: string;
};

type DataTableProps = {
  headerOuterClassName?: string;
  headingClassName?: string;
  headerChildren?: React.ReactNode;
  headerClassNames?: string;
  afterContent?: React.ReactNode;
  beforeClassName?: string;
  beforeContent?: React.ReactNode;
  tableClassNames?: SlotsToClasses<TableSlots>;
  title?: string;
  Icon?: React.ElementType;
  isLoading?: boolean;
  backgroundLoading?: boolean;
  columns: ColumnType[];
  rows: Record<string, any>[];
  rowClassName?: string;
  className?: string;
  addButtonText?: string | null;
  addButtonLink?: string | null;
  pagination?: PaginationType;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  refetch?: () => void;
};

const DataTable = ({
  headerOuterClassName,
  headingClassName,
  headerChildren,
  headerClassNames,
  columns,
  rows,
  rowClassName,
  tableClassNames,
  title,
  Icon,
  isLoading,
  backgroundLoading: backgroundLoadingProp = undefined,
  className,
  afterContent,
  beforeContent,
  beforeClassName,
  addButtonText,
  addButtonLink,
  pagination,
  onSearch,
  searchPlaceholder = 'Search...',
  refetch,
}: DataTableProps) => {
  const backgroundLoading =
    backgroundLoadingProp === undefined
      ? rows.length > 0
      : backgroundLoadingProp;
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const onSearching = (value: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 1500);
  };

  return (
    <>
      {title || Icon || headerChildren || addButtonText ? (
        <div
          className={cn(
            'relative flex items-center justify-between p-4',
            headerOuterClassName,
          )}
        >
          {(title || Icon) && (
            <h3
              className={cn(
                'text-primary flex items-center gap-2 text-2xl',
                headingClassName,
              )}
            >
              {Icon && React.createElement(Icon)}
              {title}
            </h3>
          )}
          <div className={cn('flex items-center gap-2', headerClassNames)}>
            {headerChildren && headerChildren}
            {addButtonText && (
              <Button
                as={Link}
                href={addButtonLink ?? ''}
                variant="solid"
                color="primary"
                size="sm"
              >
                <PiPlus />
                {addButtonText}
              </Button>
            )}
          </div>
        </div>
      ) : null}
      {onSearch || beforeContent ? (
        <div
          className={cn(
            'flex items-center justify-start gap-2 p-4',
            beforeClassName,
          )}
        >
          {onSearch && (
            <Input
              className="max-w-[250px]"
              isClearable
              placeholder={searchPlaceholder}
              startContent={<CiSearch />}
              size="md"
              onClear={() => onSearching('')}
              onChange={(e) => onSearching(e.target.value)}
            />
          )}
          {beforeContent ? beforeContent : <div />}
        </div>
      ) : null}
      <Table
        bottomContent={afterContent}
        isHeaderSticky
        aria-label={title}
        className={className}
        shadow="none"
        classNames={{
          ...tableClassNames,
          th: cn(
            'text-foreground-700 bg-default-100 text-base shadow-sm',
            (tableClassNames?.th as string) || '',
          ),
          tr: cn(
            'hover:bg-default-50 !shadow-none',
            (tableClassNames?.tr as string) || '',
          ),
          wrapper: cn(
            'max-h-[calc(100vh-192px)] rounded-none bg-transparent p-0 pr-3',
            (tableClassNames?.wrapper as string) || '',
          ),
          base: cn('pl-3', (tableClassNames?.base as string) || ''),
        }}
      >
        <TableHeader>
          {columns.map((column, index) => (
            <TableColumn
              className={column.className}
              key={index}
              allowsSorting={column.allowsSorting}
              align={
                column.align === 'center'
                  ? 'center'
                  : column.align === 'right'
                    ? 'end'
                    : 'start'
              }
            >
              <div
                className={cn(
                  'flex items-center gap-1 font-medium',
                  column.align === 'center' && 'justify-center',
                  column.align === 'right' && 'justify-end',
                )}
              >
                {column.icon && React.createElement(column.icon)}
                {column.title}
              </div>
            </TableColumn>
          ))}
        </TableHeader>
        {!isLoading || backgroundLoading ? (
          <TableBody>
            {rows.map((item, i) => (
              <TableRow key={i} className={cn(rowClassName)}>
                {columns.map((column, j) => (
                  <TableCell
                    key={`${i}-${j}`}
                    className={cn(column.RowClassName)}
                  >
                    {column.component ? (
                      column.component(item[column.key], item, j)
                    ) : (
                      <p className="line-clamp-1">{item[column.key]}</p>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {[1, 2, 3, 4, 5].map((_, i) => (
              <TableRow key={i}>
                {columns.map((column, j) => (
                  <TableCell key={`${i}-${j}`}>
                    {column.SkeletonComponent ? (
                      column.SkeletonComponent
                    ) : (
                      <Skeleton className="h-10 w-full rounded-lg opacity-20" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {rows.length === 0 && !isLoading ? (
        <div className="text-foreground-200 flex flex-col items-center justify-center p-4">
          <SlDrawer className="text-6xl" />
          <p>No data available</p>
        </div>
      ) : null}
      {pagination && (
        <div className="border-default-200 bg-background absolute bottom-1 left-0 flex w-full items-center justify-center border-t px-4 py-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {!isLoading || backgroundLoading ? (
                <p
                  className={cn('text-default-500', isLoading && 'opacity-50')}
                >
                  {pagination.totalItems > 0 ? (
                    <>
                      {pagination.limit * (pagination.currentPage - 1) + 1} -{' '}
                      {pagination.limit * (pagination.currentPage - 1) +
                        pagination.onThisPage}{' '}
                      out of{' '}
                    </>
                  ) : null}
                  <span className="text-primary">{pagination.totalItems} </span>
                  {pagination.counterLabel || 'items'}
                </p>
              ) : (
                <Skeleton className="h-7 min-w-32 rounded-sm opacity-20" />
              )}
              {refetch && (
                <Button
                  isLoading={isLoading}
                  variant="light"
                  isIconOnly
                  onPress={refetch}
                  size="sm"
                  title="Refresh"
                  color="primary"
                >
                  <RiRefreshLine />
                </Button>
              )}
            </div>
            {!isLoading || backgroundLoading ? (
              <Pagination
                isDisabled={isLoading}
                isCompact
                onChange={(page) => pagination.onPageChange(page)}
                page={pagination.currentPage === 0 ? 1 : pagination.currentPage}
                total={Math.ceil(pagination.totalItems / pagination.limit)}
                showControls
              />
            ) : (
              <Skeleton className="h-7 min-w-[150px] rounded-sm opacity-20" />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DataTable;
