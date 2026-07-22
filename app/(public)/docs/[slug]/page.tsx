'use client'
import { useParams } from 'next/navigation'
import { Container, Section, Heading1, Heading2, Body, Button, Navbar, Logo, Divider, Stack } from "@/components/ui"
import { DocSidebar } from "../components/DocSidebar"
import { ComponentPreview } from "../components/ComponentPreview"
import { PropsTable } from "../components/PropsTable"
import Link from 'next/link'

import { componentDocs } from '../data/components'


export default function ComponentDocPage() {
  const { slug } = useParams()
  const doc = componentDocs[slug as string]

  if (!doc) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar sticky logo={<Logo />} links={[{ label: 'Documentation', href: '/docs' }]} />
        <Container className="py-20 text-center">
          <Heading1>Component Not Found</Heading1>
          <Body className="mt-4">The component documentation you are looking for is coming soon.</Body>
          <Link href="/docs" className="mt-8 inline-block"><Button>Back to Overview</Button></Link>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar 
        sticky
        logo={<Logo />}
        links={[
          { label: 'Documentation', href: '/docs' },
          { label: 'Marketplace', href: '/' },
        ]}
        actions={<Button size="sm" variant="primary">Download Library</Button>}
      />

      <Container className="py-12">
        <div className="flex gap-10">
          <DocSidebar />
          
          <main className="flex-1 max-w-4xl">
            <header className="mb-12">
              <Heading1 className="mb-4">{doc.title}</Heading1>
              <Body size="lg" muted>{doc.description}</Body>
            </header>

            <Section padding="none" className="mb-16">
              <Heading2 className="text-xl mb-6 font-bold">Interactive Preview</Heading2>
              <ComponentPreview code={doc.previewCode} />
            </Section>

            <Divider className="my-16" />

            <PropsTable props={doc.props} />
            
            <Section padding="xl" className="mt-20 bg-dark text-white rounded-lg">
              <Stack spacing="md" align="center" className="text-center">
                <Heading2 className="text-white">Ready to use {doc.title}?</Heading2>
                <Body className="text-white/60">Import it directly into your Next.js project.</Body>
                <div className="bg-white/10 p-4 rounded-lg font-mono text-sm mt-4">
                  import {'{'} {doc.title.replace(/\s+/g, '')} {'}'} from '@/components/ui'
                </div>
              </Stack>
            </Section>
          </main>
        </div>
      </Container>
    </div>
  )
}
