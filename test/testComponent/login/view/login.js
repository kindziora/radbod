export const loginHTML = (user) => html`<form method="post">
    <h1>Payment form</h1>
    <p>Required fields are followed by <strong><abbr title="required">*</abbr></strong>.</p>
    <section>
        <h2>Contact information</h2>
        <p>
            <label for="name">
                <span>Name: </span>
                <strong><abbr title="required">*</abbr></strong>
            </label>
            <input type="text" id="name" data-name="/$user/username">
        </p>
        <p>
            <label for="mail">
                <span>E-mail: </span>
                <strong><abbr title="required">*</abbr></strong>
            </label>
            <input type="email" id="mail" data-name="/$user/mail">
        </p>
        <p>
            <label for="pwd">
                <span>age: </span>
                <strong><abbr title="required">*</abbr></strong>
            </label>
            <input type="input" id="pwd"
                data-name="/$user/age">
        </p>
        <p>
            <label for="pwd">
                <span>Password: </span>
                <strong><abbr title="required">*</abbr></strong>
            </label>
            <input type="password" id="pwd"
                data-name="/$user/password">
        </p>
    </section>

    <section>
        <p> <button type="submit">register user</button> </p>
    </section>
</form>`;