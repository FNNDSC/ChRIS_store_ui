import React from 'react';
import { shallow } from 'enzyme';
import FormInput from '../FormInput';


describe('<FormInput />', () => {
    it('renders formInput', () => {
        const Wrapper = shallow(<FormInput />)
        expect(Wrapper)
    });
});


