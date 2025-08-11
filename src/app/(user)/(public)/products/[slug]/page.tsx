import CollectionSections from "@/components/pages/collections/CollectionSections";


export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <CollectionSections handle={slug} />
    </div>
  );
}
