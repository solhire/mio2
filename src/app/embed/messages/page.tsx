import MessageFeed from '@/components/MessageFeed';

export default async function EmbedMessagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params?.interval;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const interval = value ? Number(value) : 5000;

  return (
    <div className="w-full h-full p-0 m-0">
      <MessageFeed refreshInterval={Number.isFinite(interval) ? interval : 5000} />
    </div>
  );
}


