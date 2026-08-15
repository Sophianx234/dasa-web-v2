import {
  Button,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./EmailLayout";

interface PasswordResetSuccessEmailProps {
  name: string;
  loginLink: string;
}

export default function PasswordResetSuccessEmail({ name, loginLink }: PasswordResetSuccessEmailProps) {
  return (
    <EmailLayout previewText="Your password has been successfully reset">
      <Section>
        <Text className="text-base text-gray-800 leading-6 mb-4">
          Hello {name.split(' ')[0]},
        </Text>
        <Text className="text-base text-gray-800 leading-6 mb-4">
          Your password for your DaSA App account has been successfully reset.
        </Text>
        <Text className="text-base text-gray-800 leading-6 mb-6">
          If you made this change, you're all set! You can log in using your new password.
        </Text>
        
        <Section className="text-center mb-6">
          <Button
            href={loginLink}
            className="bg-dasadeep text-[#09090b] font-semibold rounded-md py-3 px-6 text-sm"
          >
            Log In to Your Account
          </Button>
        </Section>
        
        <Text className="text-base text-gray-800 leading-6 m-0">
          If you did not request this password change, please contact our support team immediately to secure your account.
        </Text>
      </Section>
    </EmailLayout>
  );
}
