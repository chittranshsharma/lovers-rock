import React from "react";
import ListenRoom from "@/components/ListenRoom";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ListenPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return <ListenRoom slug={slug} />;
}
