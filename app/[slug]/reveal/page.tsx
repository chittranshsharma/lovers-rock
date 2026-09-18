import React from "react";
import RevealRoom from "@/components/RevealRoom";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RevealPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return <RevealRoom slug={slug} />;
}
