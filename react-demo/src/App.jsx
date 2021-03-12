import { useContext, useEffect, useRef, useState } from 'react';
import Input from './components/Input';
import Layout from './components/Layout';
import Button from './components/Button';
import { DMContext } from './Routes';
import './App.css'; // owo fancy convention - read more here [http://getbem.com/introduction/]

const ORIGIN = `https://cataas.com`;

function App() {
  // These are our states
  const [ searching, setSearching ] = useState(false);
  const ctx = useContext(DMContext);
  const [ image, setImage ] = useState();
  const [ name, setName ] = useState(``);

  console.log(ctx);

  // A "static" value for when we search for a new image (and not have it change by our input)
  const searchTerm = useRef();

  // A side-effect of searching. If our component is set to search, the effect is that
  // we start some http request to the api (Since this result isn't pure, its a side effect)
  useEffect(() => {

    // If we're not searching, there's nothing to do
    if (!searching) return;

    // This is so we can cancel the http request prematurely if this component is unmounted
    // This would prevent us from causing memory leaks from updating something that doesn't exist
    const controller = new AbortController();
    fetchCat(controller, setImage, searchTerm);


    // Our cleanup. This is what would be called when the component is unmounted or the dependencies changes
    // Our dependencies in this case is searching
    return () => controller.abort();
  }, [ searching ]);

  // This is what our component renders! Remember this is not html - it's jsx
  // This is a special sytnax that gets recompiled by babel into function calls to React.createElement
  return (
    <Layout>
      {/* className is same as class prop in html, but they call it this to not conflict with the reserved word - class */}
      <h1 className='app__title'>Give me cats</h1>
      <form
        className='app__form'
        onSubmit={e => {
          e.preventDefault();
          // Let us store this to prevent it from changing when we search and triggering our effect
          searchTerm.current = name;

          // Start the search!
          setSearching(true);
          return false;
        }}
      >
        {/* This idea of having the input value updates being reflected by a React state is called a "controlled component" */}
        <Input
          onChange={e => setName(e.currentTarget.value)}
          placeholder='etc. Sans Thierry'
          className='app__form-item'
          label='Enter your name'
          value={name}
          name='name'
        />
        <Button
          disabled={!name || searching}
          loading={searching}
        >
          Give me cat
        </Button>
      </form>
      <Button
        onClick={() => {
          ctx.setIsDM(_isDM => !_isDM);
        }}
        style={{ marginTop: 10 }}
      >
        Me want {ctx.isDarkMode ? `lightmode` : `darkmode`}
      </Button>
      {/* A conditional render, only if we have an image - do we render the actual img element in the DOM */}
      {image ? (
        <img
          onLoad={() => setSearching(false) /* We're done when the img is rendered */}
          className='app__img'
          src={image}
          alt='Cat owo'
        />
      ) : null}
    </Layout>
  );
}

export default App;

// BY THE POWER OF HOISTING!!!!
const fetchCat = async (controller, setImage, searchTerm) => {
  try {
    // Modern xhttprequest, I highly suggest using this for it's convience
    // We are done with the basic, now it's about scalable/maintainable/high quality code
    const { url } = await fetch(
      `${ORIGIN}/c/gif/s/${searchTerm.current}?json=true&hash=${Math.random()}`,
      {
        signal: controller.signal,
      },
    ).then(_ => _.json());
    setImage(`${ORIGIN}${url}`);

  } catch (err) {
    // If the request failed because of us, then theres nothing to worry about
    if (controller.signal.aborted) {
      console.log(`Request has been cancelled by normal means`);
      return;
    }

    // Handle your error here
    console.error(err.message);
  }
};
