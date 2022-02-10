import styled from 'styled-components';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import CaretDownIcon from '../../assets/images/caret-down.svg';
import CaretUpIcon from '../../assets/images/caret-up.svg';
import DeleteIcon from '../../assets/images/x-circle-fill.svg';
import LinkInfo from '../Info/LinkInfo';
import { getCondition } from '../../util';
import EmojiInfo from '../Info/EmojiInfo';
import { ModalDispatch } from '../../pages/Home';

const Row = styled.tr`
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-black);
  transition: .3s;
`;

const Section = styled.section`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Data = styled.td`
  flex: ${({ flex }) => flex};
  display: ${({ flexCenter }) => flexCenter ? 'flex' : 'block'};
  justify-content: center;
  height: ${({ height }) => height ?? '30px'};
  min-height: 30px;
  padding: ${({ padding }) => padding ?? 0};
  font-size: 20px;
  line-height: 30px;
  text-align: ${({ align }) => align ?? 'center'};
  color: ${({ isRed }) => isRed ? 'var(--color-red)' : 'var(--color-black)'};
`;

const Accent = styled.span`
  color: var(--color-red);
`;

const TitleLink = styled.a`
  &:hover {
    color: var(--color-red);
  }
`;

const List = styled.ul`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
`;

const Icon = styled.svg`
  transform: scale(1.875);
  &:hover {
    fill: var(--color-red);
  }
`;

const DetailButton = ({ detailed, setDetailed }) => {
  const handleIconClick = useCallback(() => {
    setDetailed((prev) => !prev);
  }, []);
  return (
    <Button type="button" onClick={handleIconClick}>
      {
        detailed
        ? <Icon as={CaretUpIcon} />
        : <Icon as={CaretDownIcon} />
      }
    </Button>
  )
};

const LinkData = ({ flexArr, data, index, detailed, setDetailed, handleDelete }) => {
  return (
    <>
      <Data flex={1}>{index}</Data>
      {
        flexArr.map((flex, i) => (
          <Data key={i} flex={flex} className="ellipsis">
            <TitleLink href={data.link}>{data.title}</TitleLink>
          </Data>
        ))
      }
      <Data flex={1}>
        <List>
          <li>
            <DetailButton detailed={detailed} setDetailed={setDetailed} />
          </li>
          <li>
            <Button type="button">
              <Icon as={DeleteIcon} onClick={handleDelete} />
            </Button>
          </li>
        </List>
      </Data>
    </>
  )
};

const EmojiData = ({ flexArr, data, index, detailed, setDetailed }) => {
  const { emoji, probability, isHidden } = data;
  const condition = useMemo(() => getCondition(data, Accent), [data]);
  return (
    <>
      <Data flex={1}>{index}</Data>
      <Data flex={flexArr[0]} height="auto">{emoji.join('')}</Data>
      <Data flex={flexArr[1]} height="auto" align="left" padding="0 10px">{isHidden ? '조건 비공개' : condition}</Data>
      <Data flex={flexArr[2]} isRed={probability === 1}>{`${probability * 100}%`}</Data>
      <Data flex={1} flexCenter>
        {!isHidden && <DetailButton detailed={detailed} setDetailed={setDetailed} />}
      </Data>
    </>
  )
};

const TableRow = ({ flexArr, data, index, page }) => {
  const { dispatchModal } = useContext(ModalDispatch);
  const [detailed, setDetailed] = useState(false);
  const handleDelete = useCallback(() => {
    dispatchModal({ type: 'SET_DATA_ID', value: data['_id'] });
    dispatchModal({ type: 'WINDOW', value: 'DELETE' });
  }, [])

  return (
    <Row>
      <article>
        <Section>
          {
            (() => {
              switch (page) {
                case 'link':
                  return (
                    <LinkData
                      flexArr={flexArr}
                      data={data}
                      index={index}
                      detailed={detailed}
                      setDetailed={setDetailed}
                      handleDelete={handleDelete}
                    />
                  );
                case 'emoji':
                  return (
                    <EmojiData
                      flexArr={flexArr}
                      data={data}
                      index={index}
                      detailed={detailed}
                      setDetailed={setDetailed}
                    />
                  );
                default:
                  return;
              }
            })()
          }
        </Section>
        <Section>
          {
            detailed && 
            (() => {
              switch (page) {
                case 'link':
                  return (<LinkInfo data={data} />);
                case 'emoji':
                  return (<EmojiInfo data={data} />)
                default:
                  return;
              }
            })()
          }
        </Section>
      </article>
    </Row>
  );
};

export default React.memo(TableRow);