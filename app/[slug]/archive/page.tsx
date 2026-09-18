import React from "react";
import ArchiveRoom from "@/components/ArchiveRoom";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArchivePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return <ArchiveRoom slug={slug} />;
}
