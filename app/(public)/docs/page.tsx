"use client";
import {
  Container,
  Section,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Heading1,
  Heading2,
  Body,
  Button,
  Flex,
  Stack,
  Logo,
  Navbar,
} from "@/components/ui";
import { DocSidebar } from "./components/DocSidebar";
import Link from "next/link";
import { MdFlashOn, MdLayers, MdCheckBoxOutlineBlank } from "react-icons/md";

export default function DocsPage() {
  return (
    <div className="min-h-dvh bg-cream">
      <Navbar
        sticky
        logo={<Logo />}
        links={[
          { label: "Documentation", href: "/docs" },
          { label: "Marketplace", href: "/" },
          { label: "GitHub", href: "#" },
        ]}
        actions={
          <Button size="sm" variant="outline">
            Download Library
          </Button>
        }
      />

      <Container className=" py-12">
        <div className="flex gap-10">
          <DocSidebar />

          <main className="flex-1 max-w-4xl">
            <Section padding="none" className="mb-16">
              <Stack spacing="lg">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#CD2C58]/10 text-[#CD2C58]-dark rounded-full text-xs font-bold uppercase tracking-wider">
                  <MdFlashOn />
                  Khazu Design System v4.0
                </div>
                <Heading1 className="text-4xl md:text-6xl tracking-tight">
                  The Modern Standard for Automotive Platforms.
                </Heading1>
                <Body
                  size="lg"
                  className="text-gray-800/70 leading-relaxed max-w-2xl"
                >
                  A high-performance component library built with Next.js 16,
                  Tailwind CSS 4, and Framer Motion. Crafted for speed,
                  accessibility, and premium aesthetics.
                </Body>
                <Flex gap="md" className="mt-4">
                  <Button size="lg">Get Started</Button>
                  <Button size="lg" variant="outline">
                    Browse Components
                  </Button>
                </Flex>
              </Stack>
            </Section>

            <Grid cols={2} gap="lg" className="mb-16">
              <Card
                hover
                className="bg-white/50 backdrop-blur-sm border-black/5 p-8"
              >
                <div className="w-12 h-12 bg-[#CD2C58] rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-[#CD2C58]/20">
                  <MdLayers className="text-gray-800" size={24} />
                </div>
                <Heading2 className="text-xl mb-3">Modular Components</Heading2>
                <Body size="sm" muted>
                  Over 100+ production-ready components that work seamlessly
                  together.
                </Body>
              </Card>
              <Card
                hover
                className="bg-white/50 backdrop-blur-sm border-black/5 p-8"
              >
                <div className="w-12 h-12 bg-dark rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-dark/20">
                  <MdCheckBoxOutlineBlank className="text-[#CD2C58]" size={24} />
                </div>
                <Heading2 className="text-xl mb-3">Design Driven</Heading2>
                <Body size="sm" muted>
                  Consistent spacing, typography, and motion designed
                  specifically for high-end car marketplaces.
                </Body>
              </Card>
            </Grid>

            <section id="quick-start" className="space-y-6">
              <Heading2>Quick Start</Heading2>
              <Card className="bg-dark text-white border-none p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4 text-white/40">
                  <div className="w-3 h-3 rounded-full bg-danger" />
                  <div className="w-3 h-3 rounded-full bg-[#CD2C58]" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <span className="ml-2">terminal</span>
                </div>
                <div className="text-[#CD2C58]">
                  npm install <span className="text-white">@khazu/ui</span>
                </div>
                <div className="text-gray-800-subtle"># or</div>
                <div className="text-[#CD2C58]">
                  yarn add <span className="text-white">@khazu/ui</span>
                </div>
              </Card>
            </section>
          </main>
        </div>
      </Container>
    </div>
  );
}
