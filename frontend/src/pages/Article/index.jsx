import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import parse from 'html-react-parser';

import { Template } from '../../sharedComponents/Template';
import { useGetExperienceArticle } from '../../sharedComponents/hooks';


const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 960px;
  margin: auto;
  box-sizing: border-box;
  @media screen and (max-width: 960px) {
    padding: 5px;
  }
`;

const Title = styled.h2`
  margin-bottom: 5px;
`

const Tags = styled.p`
  display: flex;
  opacity: 60%;
  margin-bottom: 10px;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  flex: 1;
  margin-bottom: 10px;

  & img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

const Article = () => {
  // React router dom get id from history
  const { id } = useParams();
  const article = useGetExperienceArticle(id);

  const mockData = {
    title: "Test header for article",
    body: `<p><img src="https://images.squarespace-cdn.com/content/v1/5210f682e4b0a807b650c92b/1380810571934-BN49FC6EW9L8OP0ESMYG/ke17ZwdGBToddI8pDm48kLwBhNumfm2cx1xE5zvxl9lZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIP7k9jdxJ1JI_9CY9gYCcpqUpO-QO9vNhDLedhIrG6-4KMshLAGzx4R3EDFOm1kBS/Block-960x600.jpg" alt="" width="960" height="600" /></p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sed lacinia felis. Mauris tincidunt, risus vel dapibus ultricies, mauris quam pulvinar urna, in scelerisque nisi lectus ac turpis. Vestibulum ultrices imperdiet urna eget suscipit. In ac imperdiet arcu. Nam vitae tempor mauris. Cras ac mauris enim. Donec felis sem, hendrerit et augue non, varius ornare eros. Aenean ac venenatis sapien. Vestibulum vitae ultrices lacus, at vehicula sem. Mauris sit amet sapien sit amet ante rhoncus ullamcorper. Nullam vulputate nulla quis nunc tincidunt, ut posuere augue euismod. Pellentesque interdum risus pulvinar ante pellentesque hendrerit.</p>
    <p>&nbsp;</p>
    <p>Etiam dictum urna vitae sodales iaculis. In pretium diam eget ex fringilla lobortis. Quisque blandit enim sapien, non cursus lectus euismod id. Integer vel arcu enim. Praesent ut accumsan mi, nec tempus felis. Phasellus semper varius tortor, eu elementum mi pellentesque quis. Quisque eu pretium elit. Curabitur vel venenatis urna, vel pellentesque elit. Curabitur sit amet dignissim ex. Pellentesque rutrum sit amet enim eget placerat. Pellentesque condimentum dolor commodo placerat accumsan. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam viverra cursus nulla, quis ultricies sem varius non.</p>
    <p>Aenean nulla massa, ornare scelerisque auctor sodales, suscipit nec nisi. Phasellus rutrum lacus rutrum quam pretium, at condimentum lectus suscipit. Duis at ultrices risus. Nullam eu turpis lorem. Nulla facilisi. Cras convallis elementum sodales. Maecenas semper, odio sed consectetur porttitor, felis dolor dignissim dolor, sit amet malesuada mi erat sed orci. Integer ut sem in lectus tristique egestas vel aliquam odio. Suspendisse consequat tempor lectus, at aliquet mi feugiat at. Nunc tincidunt, nibh ac lacinia facilisis, dolor lectus maximus felis, vitae faucibus felis enim vel lectus.</p>
    <p>Sed ut justo scelerisque leo dictum ultricies non eget sem. Vivamus tristique ornare leo eget molestie. Cras bibendum pharetra libero nec feugiat. Aenean enim tellus, rutrum accumsan pretium ut, feugiat at ipsum. Suspendisse maximus non magna id ornare. Nulla facilisi. Duis ac magna consequat justo consectetur vulputate at vitae dolor. Quisque placerat ac ligula sed aliquam. Ut malesuada felis eget odio ultricies finibus. Sed eu est tellus. Cras rhoncus velit purus, sed porttitor lorem commodo sed.</p>
    <p>Maecenas ornare congue magna eget gravida. Integer laoreet justo a odio accumsan lacinia. Nunc et lacus a arcu pretium iaculis. Vivamus pretium sed nisl vel varius. Maecenas malesuada turpis ut nunc consectetur maximus. Nunc finibus metus nulla, sit amet sagittis arcu placerat sit amet. Curabitur congue pellentesque dapibus. Quisque sodales aliquam orci, vitae commodo lacus viverra nec. Integer justo orci, interdum eget dictum quis, pulvinar non diam.</p>
    <p>Nulla facilisi. Mauris in magna nec nunc tristique imperdiet eget ut erat. Sed at venenatis arcu. Praesent tempor orci massa, a molestie lorem consectetur sit amet. Aliquam rhoncus, erat non blandit vulputate, turpis nibh condimentum elit, ac dapibus elit tellus sit amet sapien. Phasellus eget posuere nisi. Morbi auctor arcu vitae ex pulvinar, non tempor nisi volutpat. In egestas maximus laoreet. Phasellus scelerisque odio erat, ac accumsan tellus elementum ac. Sed hendrerit dui sed rutrum accumsan.</p>
    <p>Integer at nisi venenatis, ultrices orci eget, consectetur sapien. Praesent suscipit viverra orci, at sagittis ex semper quis. Donec elementum turpis id ligula bibendum luctus. Sed vitae nunc blandit, porta felis nec, scelerisque justo. Duis fringilla tellus in nulla tincidunt, id lobortis nisl vulputate. Phasellus malesuada turpis quis viverra semper. Nullam egestas sagittis enim, a faucibus metus volutpat eu. Vivamus imperdiet convallis turpis vitae iaculis. Quisque eget cursus orci. Suspendisse finibus ante orci, vel consectetur nisi feugiat luctus. Vivamus non consectetur orci. Nam hendrerit commodo massa, vitae lacinia odio consectetur eget. Praesent laoreet tempor porttitor. Donec fermentum sapien eros.</p>
    `,
    tags: ['Cool', 'New', 'Amazing', 'Rarw', 'xD', 'MAMA MIA', 'MY PIZZA', 'LOOOOOOOONg', 'Cool', 'New', 'Amazing', 'Rarw', 'xD', 'MAMA MIA', 'MY PIZZA', 'LOOOOOOOONg']
  }

  return(
  <Template>
    <Wrapper>
      <Title>{mockData.title}</Title>
      <Tags>
        {
        mockData.tags && mockData.tags.map((tag, index) => {
          if(index+1 === mockData.tags.length) {
            return `${tag}`
          }
          return `${tag}, `
        })
        }
      </Tags>
      <Body>
        {
          parse(mockData.body)
        }
      </Body>
    </Wrapper>
  </Template>);
};

export {
  Article,
};