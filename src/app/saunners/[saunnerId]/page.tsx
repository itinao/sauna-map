import { SaunnerMapPage } from "@/views/saunner-map";

type PageProps = {
  params: Promise<{
    saunnerId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export default async function Page({ params }: PageProps) {
  const { saunnerId } = await params;

  return <SaunnerMapPage saunnerId={saunnerId} />;
}
