import ApprenticeDetail from './ApprenticeDetail';

export default async function ApprenticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ApprenticeDetail id={id} />;
}