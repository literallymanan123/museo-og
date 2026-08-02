type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ArtPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div>
        <h1 className="text-3xl font-bold">Artwork</h1>
        <p className="mt-2">ID: {id}</p>
        <p className="mt-4 text-gray-400">
          Artwork page coming soon...
        </p>
      </div>
    </main>
  );
}