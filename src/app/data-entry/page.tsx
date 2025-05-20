// src/app/new-entry/page.tsx
import DataEntryForm from '@/components/data-entry-form';
import AppLayout from '@/components/layout/app-layout';

export default function NewEntryPage() {
  return (
    <AppLayout>
      <DataEntryForm />
    </AppLayout>
  );
}