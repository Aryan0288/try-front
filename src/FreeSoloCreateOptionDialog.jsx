// import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { useContext, useState } from 'react';
import { UserContext } from './UserContext';

export default function FreeSolo() {
    const [value, setValue] = useState('');
    const { newMessageText, setNewMessageText } = useContext(UserContext);
    const [inputActive, setInputActive] = useState(false);

    const handleChange = (event) => {
        setNewMessageText(event.target.value);
    };
    const handleAutocompleteChange = (event, newValue) => {
        setNewMessageText(newValue);
        setInputActive(false); // Reset on selection of an autocomplete item
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && newMessageText.trim() !== ''  && inputActive) {
            // Assuming this is how you log/send the message
            setNewMessageText(''); // Clear the input field after sending
        }
    };

    const handleFocus = () => {
        setInputActive(true); // Set when the input is focused
    };

    const handleBlur = () => {
        setInputActive(false); // Reset when the input loses focus
    };

    // console.log("input box : ", textValue)
    return (
        <Stack spacing={2} sx={{ width: '90%', marginTop: "2rem", bgcolor: 'white', borderRadius: '14px', color: 'red' }}>
            <Autocomplete 
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                inputValue={newMessageText}
                options={top100Films.map((option) => option.title)}
                onChange={handleAutocompleteChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Send message"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                            onChange: handleChange,
                            onKeyDown: handleKeyPress,
                            onFocus: handleFocus,
                            onBlur: handleBlur,
                            style: { fontFamily: 'monospace', fontWeight: "600" } // Set text color of input field (lowercase 'i')
                        }}
                        style={{ color: 'primary' }}
                        InputLabelProps={{
                            style: { color: 'black', fontWeight: "600", fontFamily: "cursive" } // Set label color to white
                        }}

                    />
                )}
            />
        </Stack>
    );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { title: 'hi, how are you doing?', year: 2894 },
    { title: 'hii', year: 1972 },
    { title: 'How are you', year: 1974 },
    { title: 'Thank you', year: 2008 },
    { title: 'No worry', year: 1957 },
    { title: "kaise ho", year: 1993 },
    { title: 'everything all right', year: 1994 },
    {
        title: 'sb badiya hai',
        year: 2003,
    },
    { title: 'aap kaise ho', year: 1966 },
    { title: 'mai acha hu', year: 1999 },
    {
        title: 'muje nhi pta',
        year: 2001,
    },
    {
        title: 'I don not know',
        year: 1980,
    },
    { title: 'nhi yr', year: 1994 },
    { title: 'not at all', year: 2010 },
    {
        title: 'home work kiya',
        year: 2002,
    },
    { title: "hn kr liya", year: 1975 },
    { title: 'shukriya', year: 1990 },
    { title: 'Danyewad', year: 1999 },
    { title: 'jarurat nhi hai', year: 1954 },
    {
        title: 'No need',
        year: 1977,
    },
    { title: 'okk', year: 2002 },
    { title: 'byy', year: 1995 },
    { title: 'kal milte hai', year: 1991 },
    { title: "you are happy", year: 1946 },
    { title: 'kaisa lga ', year: 1997 },
    { title: 'how it is', year: 1995 },
    { title: 'muje nhi aat', year: 1994 },
    { title: 'how to dot it', year: 2001 },
    { title: 'ye kaise krte hai', year: 1998 },
    { title: 'Once Upon a Time', year: 1968 },
    { title: 'tume kya lagta hai', year: 1998 },
    { title: 'kya batau', year: 2014 },
    { title: 'mai kal gumne gya tha', year: 1942 },
    { title: 'yesterday i went to roaming', year: 1931 },
    { title: 'kaisa hai bhai', year: 1960 },
    { title: 'how about yourself?', year: 1999 },
    { title: "i'm fine. how about yourself?", year: 2011 },
    { title: "i'm pretty good. thanks for asking.", year: 1936 },
    { title: "i'm pretty good. thanks for asking.", year: 1981 },
    { title: "how's it going?", year: 1954 },
    { title: "i'm doing well. how about you?", year: 2002 },
    { title: "i believe so.", year: 2006 },
    { title: "Muje bhi aisa hi lgta hai", year: 1991 },
    { title: "I know", year: 1985 },
    { title: "i know", year: 2014 },
    { title: "i think it will be.", year: 2000 },
    { title: "it's okay.", year: 2000 },
    { title: "so what were you calling me about?", year: 2006 },
    { title: " was busy doing something. i apologize.", year: 1994 },
    { title: "did you need something?", year: 1979 },
    { title: "Good morning", year: 1979 },
    { title: "Good afternoon", year: 1950 },
    {
        title: "Good evening",
        year: 1964,
    },
    { title: "Good night", year: 1940 },
    { title: "what was wrong with you?", year: 1988 },
    { title: "i was sick.", year: 2006 },
    { title: "how were you sick?", year: 1988 },
    { title: "sir", year: 1957 },
    { title: "mam", year: 2012 },
    { title: "sister", year: 1980 },
    { title: "brother", year: 2008 },
    { title: 'hlo', year: 1999 },
    { title: 'kya lagta hai', year: 2012 },
    { title: 'nhi aisa nhi hai', year: 1997 },
    { title: 'hn bhai', year: 1986 },
    { title: 'Oldboy', year: 2003 },
    { title: 'Once Upon a Time in America', year: 1984 },
    { title: 'Witness for the Prosecution', year: 1957 },
    { title: 'Das Boot', year: 1981 },
    { title: 'Citizen Kane', year: 1941 },
    { title: 'North by Northwest', year: 1959 },
    { title: 'Vertigo', year: 1958 },
    {
        title: 'Star Wars: Episode VI - Return of the Jedi',
        year: 1983,
    },
    { title: 'Reservoir Dogs', year: 1992 },
    { title: 'Braveheart', year: 1995 },
    { title: 'M', year: 1931 },
    { title: 'Requiem for a Dream', year: 2000 },
    { title: 'Amélie', year: 2001 },
    { title: 'A Clockwork Orange', year: 1971 },
    { title: 'Like Stars on Earth', year: 2007 },
    { title: 'Taxi Driver', year: 1976 },
    { title: 'Lawrence of Arabia', year: 1962 },
    { title: 'Double Indemnity', year: 1944 },
    {
        title: 'Eternal Sunshine of the Spotless Mind',
        year: 2004,
    },
    { title: 'Amadeus', year: 1984 },
    { title: 'To Kill a Mockingbird', year: 1962 },
    { title: 'Toy Story 3', year: 2010 },
    { title: 'Logan', year: 2017 },
    { title: 'Full Metal Jacket', year: 1987 },
    { title: 'Dangal', year: 2016 },
    { title: 'The Sting', year: 1973 },
    { title: '2001: A Space Odyssey', year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: 'Toy Story', year: 1995 },
    { title: 'Bicycle Thieves', year: 1948 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
];