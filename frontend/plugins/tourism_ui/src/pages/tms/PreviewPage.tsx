import { readImage } from 'erxes-ui/utils/core';
import { useEffect, useState } from 'react';
import { Input, Select } from 'erxes-ui';

const PreviewPage = () => {
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrlParams(new URLSearchParams(window.location.search));
    }
  }, []);

  const tourName = urlParams?.get('name') || 'Таны тур оператор';
  const themeColor = urlParams?.get('color') || '#4F46E5';
  const logoParam = urlParams?.get('logo');
  const logoUrl = logoParam
    ? readImage(logoParam)
    : 'https://placehold.co/150x150';

  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-screen md:flex-row md:p-6">
      <div className="p-4 w-full max-w-md sm:max-w-lg md:w-1/2">
        <div className="p-4 mx-auto rounded-lg border shadow-md sm:p-6 bg-background">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src={logoUrl}
              alt="Company Logo"
              className="object-contain w-auto h-12 sm:h-16 md:h-20"
              onError={(e) =>
                (e.currentTarget.src = 'https://placehold.co/150x150')
              }
            />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-center sm:text-xl text-foreground">
            Sign in to your account
          </h2>
          <p className="mb-4 text-sm text-center sm:mb-6 sm:text-base text-muted-foreground">
            Enter your email and password below to access your account.
          </p>
          <form className="space-y-3 sm:space-y-4">
            <Select>
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Select a branch" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Item value={tourName}>{tourName}</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select>

            <div>
              <label
                htmlFor="email"
                className="block mb-1.5 text-sm font-medium text-foreground sm:text-base"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value="info@erxes.io"
                disabled
                className="px-3 py-2 w-full text-sm rounded-md border bg-background text-foreground sm:text-base"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground sm:text-base mb-1.5"
                >
                  Password
                </label>
                <p className="text-sm sm:text-base text-primary">
                  Forgot password?
                </p>
              </div>
              <Input
                id="password"
                type="password"
                value="••••••••"
                disabled
                className="px-3 py-2 w-full text-sm rounded-md border bg-background text-foreground sm:text-base"
              />
            </div>
            <button
              type="button"
              disabled
              className="px-4 py-1.5 mt-5.5 w-full text-sm text-white rounded-md sm:text-base"
              style={{ backgroundColor: themeColor }}
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
