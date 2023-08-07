import React from 'react';
import styled from 'styled-components';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

const ControlBox = styled.div`
  position: absolute;
  left: 0;
  margin: 16px;
  top: 0;
  transition: left 0.5s;
  transform: translateX(0px);
  z-index: 1000;
`;

const SearchBox = styled.div`
  position: relative;
  background: #fff;
  border-radius: 2px;
  width: 200px;
  height: 20px;
  border-bottom: 1px solid transparent;
  padding: 12px 70px 11px 70px;
  transition: background 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
`;

const SearchBoxMenuContainer = styled.div`
  position: absolute;
  z-index: 1003;
  left: 0;
  top: 0;
`;

const SearchBoxMenuButton = styled(IconButton)`
  display: block;
  cursor: pointer;
  padding: 12px 16px;
`;

const StyledInputBase = styled(InputBase)`
  width: 100%;
  padding-top: 0;  // 调整上内边距
  padding-bottom: 0;  // 调整下内边距
`;

const SearchBoxSearchButtonContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0px;
  border-left: 1px solid #ddd;

`;

const SearchBoxSearchButton = styled(IconButton)`
  display: block;
  padding: 2px 15px;
  cursor: pointer;
  opacity: 0.61;
  &:hover {
    opacity: 0.98;
  }
`;

export default function CustomizedInputBase() {
  return (
    <ControlBox>
      <SearchBox>
        <SearchBoxMenuContainer>
          <SearchBoxMenuButton aria-label="menu">
            <MenuIcon />
          </SearchBoxMenuButton>
        </SearchBoxMenuContainer>
        <StyledInputBase
          placeholder="Search"
          inputProps={{ 'aria-label': 'search' }}
        />
        <SearchBoxSearchButtonContainer>
          <SearchBoxSearchButton aria-label="search">
            <SearchIcon />
          </SearchBoxSearchButton>
        </SearchBoxSearchButtonContainer>
      </SearchBox>
    </ControlBox>
  );
}