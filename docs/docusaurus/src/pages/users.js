import React from 'react';
import Layout from '@theme/Layout';

function Users(props) {
  const { config: siteConfig } = props;
  const { users = [], repoUrl } = siteConfig.customFields;
  if ((users || []).length === 0) {
    return null;
  }

  const editUrl = `${siteConfig.repoUrl}/edit/master/website/siteConfig.js`;
  const showcase = users.map((user) => (
    <a href={user.infoLink} key={user.infoLink}>
      <img src={user.image} alt={user.caption} title={user.caption} />
    </a>
  ));

  return (
    <Layout title="Users">
      <div className="showcaseSection">
        <div className="prose">
          <h1>Who is Using This?</h1>
          <p>This project is used by many folks</p>
        </div>
        <div className="logos">{showcase}</div>
        <p>Are you using this project?</p>
        <a href={editUrl} className="button">
          Add your company
        </a>
      </div>
    </Layout>
  );
}

export default Users;
