import { Page, Layout, LegacyCard,MediaCard } from '@shopify/polaris';
import React from 'react';

function LayoutExample() {
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <LegacyCard title="Online store dashboard" sectioned>
            <p>View a summary of your online store’s performance.</p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section>
          <MediaCard
            title="Getting Started"
            primaryAction={{
              content: 'Learn about getting started',
              onAction: () => { },
            }}
            description="Discover how Shopify can power up your entrepreneurial journey."
            popoverActions={[{ content: 'Dismiss', onAction: () => { } }]}
          >
            <img
              alt=""
              width="100%"
              height="100%"
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              src="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
            />
          </MediaCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default LayoutExample