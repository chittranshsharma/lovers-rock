import React from "react";
import PlayRoom from "@/components/PlayRoom";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlayPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return <PlayRoom slug={slug} />;
}
