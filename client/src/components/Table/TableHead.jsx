import styled from 'styled-components';

const Head = styled.tr`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  margin-top: 20px;
  border-bottom: 2px solid var(--color-black);
`;

const Field = styled.th`
  flex: ${({ flex }) => flex};
  font-size: 25px;
`;

const TableHead = ({ flexArr, head }) => {
  return (
    <thead>
      <Head>
        <Field flex={1}>번호</Field>
          {flexArr.map((flex, i) => (<Field key={i} flex={flex}>{head[i]}</Field>))}
        <Field flex={1} />
      </Head>
    </thead>
  );
};

export default TableHead;