import type { ReactNode } from 'react';

type StatusMessageProps = {
  children: ReactNode;
  isError?: boolean;
};

export default function StatusMessage({ children, isError = false }: StatusMessageProps) {
  const className = isError ? 'status status-error' : 'status';

  return (
    <main className="page">
      <div className="container">
        <p className={className}>{children}</p>
      </div>
    </main>
  );
}
