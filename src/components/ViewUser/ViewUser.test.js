import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import ViewUser from './ViewUser';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

it('renders without crashing', () => {
    let json = require("../../__mocks__/login.json");
    const history = createMemoryHistory('/view-user/1');
    const wrapper = mount(
        <MemoryRouter>
            <ViewUser onEdit={() => { }} history={history} user={json.user} />
        </MemoryRouter>
    );
    expect(wrapper.find('.user-profile')).toHaveLength(1);

});
