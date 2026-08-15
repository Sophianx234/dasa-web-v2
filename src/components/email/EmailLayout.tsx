import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
  Link,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  previewText?: string;
  children: React.ReactNode;
}

export default function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                dasalight: "#FEF3E7",
                dasadeep: "#ffd8a8",
                textMain: "#09090b",
                textMuted: "#71717a",
                bgLight: "#FEF3E7",
                borderLight: "#e5e7eb",
              },
              fontFamily: {
                sans: [
                  "-apple-system",
                  "BlinkMacSystemFont",
                  "'Segoe UI'",
                  "Roboto",
                  "Oxygen-Sans",
                  "Ubuntu",
                  "Cantarell",
                  "'Helvetica Neue'",
                  "sans-serif",
                ],
              },
            },
          },
        }}
      >
        <Body className=" font-sans m-0 py-10">
          <Container className="bg-white border border-borderLight rounded-xl overflow-hidden mx-auto max-w-[600px] shadow-sm">
            
            {/* Header (Matching DasaLogo aesthetic) */}
            <Section className="px-8 py-6 border-b border-borderLight bg-white">
              <Row>
                <Column width="70" align="right">
                  <Img
                    src="https://i.ibb.co/n8hRM6d/dasalogo-removebg.png"
                    width="60"
                    height="60"
                    alt="DaSA Logo"
                    className="drop-shadow-sm"
                  />
                </Column>
                <Column width="20" align="center">
                  <div style={{ borderLeft: '2px solid #d4d4d8', height: '45px', margin: '0 auto' }}></div>
                </Column>
                <Column align="left">
                  <Text className="m-0 font-bold text-textMain text-base leading-tight tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Dagbon Students <br />
                    <span style={{ color: '#ffd8a8' }}>Association</span>
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Main Content (Padded) */}
            <Section className="px-8 py-10">
              {children}
            </Section>

            {/* Footer */}
            <Section className=" px-8 py-10 text-center">
              <Text className="text-textMuted text-xs leading-relaxed mb-4">
                You are receiving this email because you are a registered member of the Dagbon Students Association (DaSA) web application.
              </Text>
              
              <Row className="mb-4">
                <Column align="center">
                  <Link href="mailto:support@dasa.com" className="text-dasadeep underline text-xs px-2 font-medium">
                    Contact Support
                  </Link>
                  <span className="text-textMuted text-xs">•</span>
                  <Link href="https://dasa.com/privacy" className="text-dasadeep underline text-xs px-2 font-medium">
                    Privacy Policy
                  </Link>
                  <span className="text-textMuted text-xs">•</span>
                  <Link href="https://dasa.com/terms" className="text-dasadeep underline text-xs px-2 font-medium">
                    Terms of Service
                  </Link>
                </Column>
              </Row>

              <Text className="text-textMuted text-xs mb-0">
                © {new Date().getFullYear()} Dagbon Students Association. All rights reserved.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
