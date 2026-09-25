import EmptyState from './components/ui/EmptyState';

export default function Table({
  columns,
  rows,
  emptyTitle = 'No records found',
  emptyDescription
}) {
  if (rows.length === 0) {
    return (
    <EmptyState
    title={emptyTitle}
    description={emptyDescription}
    />
    );
}

  return (
    <div className="overflow-x-auto">
        <table className="table-shell">
            <thead>
                <tr>
                  {columns.map((column) => (
                  <th key={column.key}>
                  {column.header}
                  </th>
                ))}
                </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                  <tr key={row.id}>
                    {columns.map((column) => (
                        <td key={column.key}>
                            {column.render
                            ? column.render(row)
                            : row[column.key]
                            }

                        </td>
                  ))}

                </tr>
            ))}
            </tbody>
            </table>
            </div>
    );
}