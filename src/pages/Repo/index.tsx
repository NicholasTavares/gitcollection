import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link, useRouteMatch } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import { Header, RepoInfo, Issues } from './styles'
import { api } from '../../services/api'

interface IRepositoryParams {
  repository: string
}

interface IGitHubRepository {
  full_name: string
  description: string
  forks_count: number
  open_issues_count: number
  stargazers_count: number
  owner: {
    login: string
    avatar_url: string
  }
}

interface IGitHubIssue {
  id: number
  title: string
  html_url: string
  user: {
    login: string

  }
}

const Repo: React.FC = () => {
  const [repository, setRepository] = React.useState<IGitHubRepository | null>(null)
  const [issues, setIssues] = React.useState<IGitHubIssue[]>([])
  const { params } = useRouteMatch<IRepositoryParams>()

  React.useEffect(() => {
    api
      .get(`repos/${params.repository}`)
      .then(response => setRepository(response.data))

    api
      .get(`repos/${params.repository}/issues`)
      .then(response => setIssues(response.data))
  }, [params.repository])

  return (
    <>
      <Header>
        <img src={logo} alt="GitCollection" />
        <Link to="/">
          <FiChevronLeft />
          Voltar
        </Link>
      </Header>

      {repository && (
        <RepoInfo>
          <header>
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepoInfo>
      )}

      <Issues>
        {issues.map(issue => (
          <a href={issue.html_url} key={issue.id}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  )
}

export default Repo
