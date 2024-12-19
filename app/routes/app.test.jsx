import { useLoaderData, Form } from '@remix-run/react';
import { json } from '@remix-run/node';
import React from 'react'
import { Layout } from '@shopify/polaris';

export async function loader() {
    const test = {
        name: "ali",
        email: "ali@gmail.com"
    }
    return json(test);
}
export async function action({ request }) {
    const formData = await request.formData();


    // await updateUser(user.id, {
    //     email: formData.get("email"),
    //     name: formData.get("name"),
    // });

    return json({ name: formData.get("name"), email: formData.get("email") });
}
const Test = () => {
    const user = useLoaderData();
    console.log("get test data: ", user)
    return (
        <Layout>
            <ui-title-bar title="Products">
                <button onclick="console.log('Secondary action')">Secondary action</button>
                <button variant="primary" onclick="console.log('Primary action')">
                    Primary action
                </button>
            </ui-title-bar>
            <Form method="post">
                <h1>Settings for {user.name}</h1>

                <input
                    name="name"
                    defaultValue={user.name}
                />
                <input name="email" defaultValue={user.email} />

                <button type="submit">Save</button>
            </Form>

        </Layout>

    )
}

export default Test