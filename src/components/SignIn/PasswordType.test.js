import React from 'react';
import { shallow } from 'enzyme';
import FormInput from '../FormInput';


describe('<FormInput />', () => {
    it('renders formInput', () => {
        const Wrapper = shallow(<FormInput />)
        expect(Wrapper)
        
    });

    it('ensures formInput has property of inputType with property passwordType', () => {
        const wrapper = shallow(<FormInput passwordType="password"/>);
        expect(wrapper);
    });

   it('confirms the state changes on mouseEnter', () => {
       const wrapper  = shallow(<FormInput passwordType="password" />)

       wrapper.simulate('onMouseEnter')
       expect(wrapper.state('inputType')).toEqual('text');
   });

});

