import {
  Button,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./EmailLayout";

interface ResetPasswordEmailProps {
  resetLink: string;
  name: string;
}

export default function ResetPasswordEmail({ resetLink, name }: ResetPasswordEmailProps) {
  return (
    <EmailLayout previewText="Reset your DaSA App password">
      <Section>
        <Text className="text-base text-gray-800 leading-6 mb-4">
          Hello {name.split(' ')[0]},
        </Text>
        <Text className="text-base text-gray-800 leading-6 mb-6">
          Someone recently requested a password change for your DaSA App account. If this was you, you can set a new password here:
        </Text>
        
        <Section className="mb-6">
          <Button
            href={resetLink}
            className="bg-dasadeep text-[#09090b] font-semibold rounded-md py-3 px-6 text-sm"
          >
            Reset Password
          </Button>
        </Section>
        
        <Text className="text-base text-gray-800 leading-6 mb-4">
          If you don't want to change your password or didn't request this, just ignore and delete this message.
        </Text>
        
        <Text className="text-base text-gray-800 leading-6 m-0">
          To keep your account secure, please don't forward this email to anyone.
        </Text>
      </Section>
    </EmailLayout>
  );
}
