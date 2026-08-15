import {
  Button,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./EmailLayout";

interface WelcomeEmailProps {
  name: string;
  loginLink: string;
}

export default function WelcomeEmail({ name, loginLink }: WelcomeEmailProps) {
  return (
    <EmailLayout previewText="Welcome to the Dagbon Students Association!">
      <Section>
        <Text className="text-base text-gray-800 leading-6 mb-4">
          Hello {name.split(' ')[0]},
        </Text>
        <Text className="text-base text-gray-800 leading-6 mb-4">
          Welcome to the Dagbon Students Association (DaSA)! We are thrilled to have you join our community.
        </Text>
        <Text className="text-base text-gray-800 leading-6 mb-6">
          Our platform is designed to connect students, share resources, and build a strong network. Feel free to explore the features and connect with other members.
        </Text>
        
        <Section className="text-center mb-6">
          <Button
            href={loginLink}
            className="bg-dasadeep text-[#09090b] font-semibold rounded-md py-3 px-6 text-sm"
          >
            Access Your Account
          </Button>
        </Section>
        
        <Text className="text-base text-gray-800 leading-6 m-0">
          If you have any questions or need assistance, simply reply to this email. We're always here to help.
        </Text>
      </Section>
    </EmailLayout>
  );
}
