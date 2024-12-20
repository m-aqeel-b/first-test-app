import { Layout, Card, Text, Page } from '@shopify/polaris'
import React from 'react'

const collections = () => {
    return (
        <Page fullWidth>
            <Layout>
                <Layout.Section>
                    <Card>
                        <Text as="h2" variant="bodyMd">
                            Collections List are below:
                        </Text>
                    </Card>
                </Layout.Section>

            </Layout>
        </Page>

    )
}

export default collections