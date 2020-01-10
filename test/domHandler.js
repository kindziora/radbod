import {domHandler} from '../build/domHandler.js';
import browserEnv from 'browser-env';
browserEnv();

export class testDomHandler{
    

    constructor(){
        this.maindiv = document.createElement("div");
        this.maindiv.setAttribute("data-name", "userform");
        this.maindiv.innerHTML = ` 
            <form method="post" >
                <h1>Payment form</h1>
                <p>Required fields are followed by <strong><abbr title="required">*</abbr></strong>.</p>
                <section>
                    <h2>Contact information</h2>
                    <fieldset>
                      <legend>Title</legend>
                      <ul>
                          <li>
                            <label for="title_2">
                              <input type="radio" id="title_2" data-name="/$user/userdata/title" value="A">
                              Ace
                            </label>
                          </li>
                          <li>
                            <label for="title_1">
                              <input type="radio" id="title_1" data-name="/$user/userdata/title" value="K" >
                              King
                            </label>
                          </li>
                          <li>
                            <label for="title_2">
                              <input type="radio" id="title_2" data-name="/$user/userdata/title" value="Q">
                              Queen
                            </label>
                          </li>
                      </ul>
                    </fieldset>
                    <p>
                      <label for="name">
                        <span>Name: </span>
                        <strong><abbr title="required">*</abbr></strong>
                      </label>
                      <input type="text" id="name" data-name="/$user/userdata/username">
                    </p>
                    <p>
                      <label for="mail">
                        <span>E-mail: </span>
                        <strong><abbr title="required">*</abbr></strong>
                      </label>
                      <input type="email" id="mail" data-name="/$user/userdata/usermail">
                    </p>
                    <p>
                      <label for="pwd">
                        <span>Password: </span>
                        <strong><abbr title="required">*</abbr></strong>
                      </label>
                      <input type="password" id="pwd" data-name="/$user/userdata/password">
                    </p>
                </section>
                <section>
                    <h2>Payment information</h2>
                    <p>
                      <label for="card">
                        <span>Card type:</span>
                      </label>
                      <select id="card" data-name="usercard">
                        <option value="visa">Visa</option>
                        <option value="mc">Mastercard</option>
                        <option value="amex">American Express</option>
                      </select>
                    </p>
                    <p>
                      <label for="number">
                        <span>Card number:</span>
                        <strong><abbr title="required">*</abbr></strong>
                      </label>
                        <input type="tel" id="number" data-name="cardnumber">
                    </p>
                    <p>
                      <label for="date">
                        <span>Expiration date:</span>
                        <strong><abbr title="required">*</abbr></strong>
                        <em>formatted as mm/yy</em>
                      </label>
                      <input type="date" id="date" data-name="expiration">
                    </p>
                </section>
                <section>
                    <p> <button type="submit">Validate the payment</button> </p>
                </section>
            </form>
       `;

        this.domHandler = new domHandler(this.maindiv);

    }


}