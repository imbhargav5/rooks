# @rooks/use-navigator-language

### Installation

```
npm install --save @rooks/use-navigator-language
```

### Usage

```react
function Demo() {
 const language = useNavigatorLanguage();
  return <p>Language is {language}</p>;
}

render(<Demo/>)
```

### Return value

A language (String) is returned.

Navigator Language hook for React
