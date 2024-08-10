import React from 'react';

import {SidebarTree} from './SortableTree';

export default {
  title: 'Examples/Tree/Sortable',
};

const Wrapper = ({children}: {children: React.ReactNode}) => (
  <div
    style={{
      maxWidth: 600,
      padding: 10,
      margin: '0 auto',
      marginTop: '10%',
    }}
  >
    {children}
  </div>
);

export const AllFeatures = () => (
  <Wrapper>
    <SidebarTree collapsible indicator removable />
  </Wrapper>
);

export const BasicSetup = () => (
  <Wrapper>
    <SidebarTree />
  </Wrapper>
);

export const DropIndicator = () => (
  <Wrapper>
    <SidebarTree indicator />
  </Wrapper>
);

export const Collapsible = () => (
  <Wrapper>
    <SidebarTree collapsible />
  </Wrapper>
);

export const RemovableItems = () => (
  <Wrapper>
    <SidebarTree removable />
  </Wrapper>
);
