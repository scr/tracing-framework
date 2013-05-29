# wtf-trace File Format

Also known as the Chunked File Format. Code for this lives in wtf.io.cff.

This format is an optimized, binary format designed for efficient construction
during recording, streaming and partial loading, and potentially very large
file sizes. It's not human readable and isn't designed to be easy to write
parsers for. If custom tools or readability is important see the JSON file
format instead.

Each file consists of a header and a variable number of chunked data blobs.

```
- 4b magic number: 0xDEADBEEF
- 4b WTF version: wtf.version.getValue()
- 4b format version: wtf.data.formats.BinaryTrace.VERSION
- chunk 0 (file header)
  - header data
- chunk 1 (event data)
  - string table for event data in chunk
  - large embedded resource used in chunk
  - large embedded resource used in chunk
  - event data
- chunk 2 (event data)
  - string table for event data in chunk
  - event data
- ...
```

Note: all values in little-endian.

## Chunks

All data within the file is organized into chunks. There are several chunk types
designed to each hold different data types. Content in one chunk may not
reference content in another (unless under special circumstances), to ensure
streaming and file slicing.

Each chunk consists of a small header plus a variable number of multiple parts.
The parts present in a chunk vary from type to type.

```
4b  chunk id
4b  chunk type
4b  chunk length (including header)
4b  chunk starting time/value
4b  chunk ending time/value
4b  part count
list of length part count
4b  part type
4b  part offset in chunk
4b  part length
/list
*   chunk data, if any
```

## Chunk Types

### Chunk Type 0x0: File Header

The header chunk must be the first chunk in the file and contains the header
data part used to describe the file.

Contains the following parts:

* File Header (required, only one)

### Chunk Type 0x1: Event Data

Event data chunks contain an optional string table used by the actual event
data buffer, optional binary resources referenced used by the event data, and
finally the event data buffer itself.

Contains the following parts:

* Event Buffer (required, only one)
* String Table (optional, only one)
* Embedded Resource (optional, multiple allowed)

Event data is read forward and all required information must be present by the
time it starts parsing. Because of this event data must only reference data
such as resources that are contained within its own chunk.

## Chunk Part Types

### Part Type 0x10000: File Header

The file header is encoded in JSON.

```
{
  // General information:
  "flags": 0, // Bitmask of wtf.data.formats.FileFlags
  "timebase": 123, // All times are relative to this.

  // The result of wtf.data.ScriptContextInfo.serialize:
  "context_info": {
    // Required:
    "contextType": "script",
    "uri": "http://...",

    // Optional:
    "title": "My page",
    "icon": {
      "uri": "http://..."
    },
    "taskId": "process ID/etc",
    "args": [arguments used on startup],
    "userAgent": {
      "value": "user agent string",
      "type": "unknown|nodejs|opera|ie|gecko|webkit",
      "platform": "mac|windows|linux|other",
      "platformVersion": "OS version/etc",
      "device": "desktop|server|chrome|iphone|ipad|android|mobile"
    }
  },

  // Optional:
  "metadata": {
    // Various information values.
  }
}
```

### Part Type 0x20000: Event Buffer

Each event data entry shares a standard header followed by a variable number
of bytes containing the event-specific arguments:

```
2b  event wire ID
4b  time/value
*   argument data, if any
```

#### Event Types / Wire IDs

Events are defined using the special `wtf.event#define` event that is built into
the file loader. This is the only implicitly defined event and all others must
be defined by the file. This event maps data from `wtf.trace.EventType`.

```
wtf.event#define(uint16 wireId, uint16 eventClass, uint32 flags,
                 ascii name, ascii args)
```

For efficiency an indirection table is built while the file is loaded. New
events are defined in the file and are assigned a wire ID that is used to
reference the event type in future entries. Events must be defined before any
entry tries to reference its wire ID. The wire ID of `wtf.event#define` is
always 1.

#### Argument Data

There are many types of argument data values. See `wtf.trace.EventTypeBuilder`
for the full list and how each is written into the file. In general, they
follow the write* methods from `wtf.io.Buffer`.

#### Zones

Events are attributed to zones of execution. Zones must be created via
`wtf.zone#create` events and then made active via `wtf.zone#set`.

Typical flows look like this:
```
wtf.event#define(... wtf.zone#create ...)
wtf.event#define(... wtf.zone#set ...)
wtf.event#define(... myEvent ...)
wtf.zone#create(zoneId=5, ...)
wtf.zone#create(zoneId=6, ...)
wtf.zone#set(zoneId=5)
myEvent() // in zone 5
myEvent() // also in zone 5, as it's a sticky setting
wtf.zone#set(zoneId=6)
myEvent() // in zone 6
```

### Part Type 0x30000: String Table

String tables are used to optimize the write time of strings during recording.

Strings in the table are given a string-table unique 4-byte ordinal. Identical
string values may be present in the table multiple times but with different
ordinals. The ordinal is a reference into the stored string list, though it
should be treated as opaque.

Strings are stored in utf8 separated by `\0`. Reading out the table is as simple
as a `table.split('\0')`.

Example:

```
some\0strings\0in\0\a\0table\0
```

### Part Type 0x4XXXX: Embedded Resource

Embedded resources are (often) large binary data resources that can be
referenced by their part ordinal. They are designed for 1K+ data sizes (as there
is file size overhead and extra time required to load/resolve them).
For example, one would not store a 4x4 transformation matrix in as a binary
resource, but texture contents or an XHR response would be a good candidate.

Embedded resources are identified by their ordinal with in their chunk, so the
first embedded resource has ID 0, the second 1, etc. The part header is used to
indicate the length of the resource body.

The lower 16 bits of the part type indicate the basic type of the resource:

* Part type 0x40000: binary (ArrayBuffer) contents
* Part type 0x40001: string contents
