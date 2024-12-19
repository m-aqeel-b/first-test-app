import { useLoaderData, Form } from '@remix-run/react';
import { json } from '@remix-run/node';
import React from 'react'

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
        <div>
            <Form method="post">
                <h1>Settings for {user.name}</h1>

                <input
                    name="name"
                    defaultValue={user.name}
                />
                <input name="email" defaultValue={user.email} />

                <button type="submit">Save</button>
            </Form>
        </div>
    )
}

export default Test